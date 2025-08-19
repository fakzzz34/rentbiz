/* File: app/api/operators/route.ts */
import { createClient } from "@supabase/supabase-js";
import * as kv from "@/app/lib/kv_store";
import { NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fungsi pembantu untuk memverifikasi token autentikasi
async function verifyAuth(token: string | null): Promise<User | null> {
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.log('Auth verification error:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user || user.user_metadata.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 401 });
  }

  try {
    const users = await kv.getByPrefix('user_');
    const operators = users.filter((userData: any) => userData.role === 'operator');

    // Perkaya dengan data deposit
    const enrichedOperators = await Promise.all(operators.map(async (op: any) => {
      // Supaya lebih efisien, kita perlu mengambil key yang benar dari hasil getByPrefix
      // Contoh ini mengasumsikan kv.getByPrefix mengembalikan array of objects
      const userId = op.key.replace('user_', '');
      const deposits = await kv.getByPrefix(`deposit_${userId}_`);
      
      return {
        ...op,
        id: userId,
        totalDeposits: deposits.reduce((sum: number, dep: any) =>
          sum + (dep.cashAmount || 0) + (dep.qrisAmount || 0) + (dep.manualAmount || 0), 0
        ),
        depositsCount: deposits.length
      };
    }));

    return NextResponse.json({ operators: enrichedOperators });
  } catch (error) {
    console.log('Get operators error:', error);
    return NextResponse.json({ error: 'Failed to fetch operators' }, { status: 500 });
  }
}
