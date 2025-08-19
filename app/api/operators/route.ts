// File: app/api/operators/route.ts
import { createClient } from "@supabase/supabase-js";
import * as kv from "@/app/lib/kv_store";
import { NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

interface OperatorData {
  role: 'owner' | 'operator' | 'admin';
  // Tambahkan properti lain yang mungkin ada di data user Anda
  // Misalnya: name, email, dll.
  [key: string]: any; // fallback untuk properti tambahan
}

interface DepositData {
  cashAmount: number;
  qrisAmount: number;
  manualAmount: number;
  // Tambahkan properti lain jika ada, misalnya:
  // date: string;
}

// -----------------------------------------------------------------------------
// Supabase & Authentication
// -----------------------------------------------------------------------------

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Memverifikasi token autentikasi pengguna.
 * @param {string | null} token Token JWT dari header Authorization.
 * @returns {Promise<User | null>} Objek pengguna jika token valid, jika tidak, null.
 */
async function verifyAuth(token: string | null): Promise<User | null> {
  if (!token) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error('Auth verification failed:', error?.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// API Route Handler
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user || user.user_metadata.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 401 });
  }

  try {
    // Mengambil semua user dan melakukan type assertion
    const users = await kv.getByPrefix<OperatorData>('user_');
    const operators = users.filter(userData => userData.role === 'operator');

    // Perkaya dengan data deposit
    const enrichedOperators = await Promise.all(operators.map(async op => {
      // Asumsikan key di dalam object op adalah userId
      const userId = op.key?.replace('user_', '') || ''; // Menggunakan optional chaining dan fallback
      if (!userId) {
        // Jika tidak ada userId, kembalikan objek operator tanpa deposit
        return { ...op, totalDeposits: 0, depositsCount: 0 };
      }

      const deposits = await kv.getByPrefix<DepositData>(`deposit_${userId}_`);

      return {
        ...op,
        id: userId,
        totalDeposits: deposits.reduce((sum, dep) =>
          sum + (dep.cashAmount || 0) + (dep.qrisAmount || 0) + (dep.manualAmount || 0), 0
        ),
        depositsCount: deposits.length
      };
    }));

    return NextResponse.json({ operators: enrichedOperators });
  } catch (error) {
    console.error('Get operators error:', error);
    return NextResponse.json({ error: 'Failed to fetch operators' }, { status: 500 });
  }
}
