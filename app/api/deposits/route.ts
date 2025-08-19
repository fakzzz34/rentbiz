/* File: app/api/deposits/route.ts */
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
    return NextResponse.json({ deposits });
  } catch (error) {
    console.log('Get deposits error:', error);
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cashAmount, qrisAmount, shift, notes } = await request.json();

    const depositId = crypto.randomUUID();
    const depositData = {
      id: depositId,
      userId: user.id,
      cashAmount: parseFloat(cashAmount) || 0,
      qrisAmount: parseFloat(qrisAmount) || 0,
      shift,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    await kv.set(`deposit_${user.id}_${depositId}`, depositData);

    const userData = await kv.get(`user_${user.id}`) || {};
    userData.lastDeposit = new Date().toISOString().split('T')[0];
    userData.canLogin = true;
    await kv.set(`user_${user.id}`, userData);

    return NextResponse.json({ success: true, deposit: depositData });
  } catch (error) {
    console.log('Create deposit error:', error);
    return NextResponse.json({ error: 'Failed to create deposit' }, { status: 500 });
  }
}
