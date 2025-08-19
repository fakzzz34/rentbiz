/* File: app/api/expenses/route.ts */
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
    const expenses = await kv.getByPrefix(`expense_${user.id}_`);
    return NextResponse.json({ expenses });
  } catch (error) {
    console.log('Get expenses error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, amount, category, dueDate, isRecurring, frequency, autoReminder, notes } = await request.json();

    const expenseId = crypto.randomUUID();
    const expenseData = {
      id: expenseId,
      userId: user.id,
      name,
      amount: parseFloat(amount),
      category,
      dueDate,
      isRecurring,
      frequency,
      autoReminder,
      notes: notes || '',
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    await kv.set(`expense_${user.id}_${expenseId}`, expenseData);

    return NextResponse.json({ success: true, expense: expenseData });
  } catch (error) {
    console.log('Create expense error:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
