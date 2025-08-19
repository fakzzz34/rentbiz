/* File: app/api/analytics/route.ts */
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

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deposits = await kv.getByPrefix(`deposit_${user.id}_`);
    const expenses = await kv.getByPrefix(`expense_${user.id}_`);

    // Menghitung analitik
    const totalIncome = deposits.reduce((sum: number, deposit: any) =>
      sum + (deposit.cashAmount || 0) + (deposit.qrisAmount || 0) + (deposit.manualAmount || 0), 0
    );

    const monthlyExpenses = expenses
      .filter((exp: any) => exp.isRecurring && exp.frequency === 'monthly')
      .reduce((sum: number, exp: any) => sum + exp.amount, 0);

    const analytics = {
      totalIncome,
      monthlyExpenses,
      breakEvenPoint: monthlyExpenses,
      depositsCount: deposits.length,
      expensesCount: expenses.length
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.log('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
