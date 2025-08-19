// File: app/api/analytics/route.ts

import { createClient, User } from "@supabase/supabase-js";
import * as kv from "@/app/lib/kv_store";
import { NextResponse } from 'next/server';

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

// Mendefinisikan antarmuka untuk data yang disimpan di KV store
interface DepositData {
  cashAmount: number;
  qrisAmount: number;
  manualAmount: number;
  // Menambahkan properti lain jika ada, misalnya:
  // date: string;
}

interface ExpenseData {
  amount: number;
  isRecurring: boolean;
  frequency: 'monthly' | 'weekly' | 'daily' | 'one-time';
  // Menambahkan properti lain jika ada, misalnya:
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

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Mengambil data deposit dan expense dengan prefix yang spesifik untuk user
    const deposits = (await kv.getByPrefix(`deposit_${user.id}_`)) as DepositData[];
    const expenses = (await kv.getByPrefix(`expense_${user.id}_`)) as ExpenseData[];

    // -----------------------------------------------------------------------------
    // Kalkulasi Analitik
    // -----------------------------------------------------------------------------

    // Menghitung total pemasukan dari semua sumber
    const totalIncome = deposits.reduce((sum, deposit) =>
      sum + (deposit.cashAmount || 0) + (deposit.qrisAmount || 0) + (deposit.manualAmount || 0), 0
    );

    // Menghitung total pengeluaran
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Menghitung pengeluaran bulanan yang berulang
    const monthlyRecurringExpenses = expenses
      .filter((exp) => exp.isRecurring && exp.frequency === 'monthly')
      .reduce((sum, exp) => sum + exp.amount, 0);

    // Menghitung sisa saldo (net balance)
    const netBalance = totalIncome - totalExpenses;

    const analytics = {
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      monthlyRecurringExpenses: monthlyRecurringExpenses,
      netBalance: netBalance,
      depositsCount: deposits.length,
      expensesCount: expenses.length,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
