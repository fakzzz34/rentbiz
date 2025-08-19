/* File: app/api/deposits/manual/route.ts */
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

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user || user.user_metadata.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 401 });
  }

  try {
    const { operatorId, amount, notes, date } = await request.json();

    const depositId = crypto.randomUUID();
    const depositData = {
      id: depositId,
      userId: operatorId,
      cashAmount: 0,
      qrisAmount: 0,
      manualAmount: parseFloat(amount),
      shift: 'manual',
      notes: notes || 'Manual override by owner',
      date,
      timestamp: new Date().toISOString(),
      status: 'manual_override'
    };

    await kv.set(`deposit_${operatorId}_${depositId}`, depositData);

    const userData = await kv.get(`user_${operatorId}`) || {};
    userData.lastDeposit = date;
    userData.canLogin = true;
    await kv.set(`user_${operatorId}`, userData);

    return NextResponse.json({ success: true, deposit: depositData });
  } catch (error) {
    console.log('Manual deposit error:', error);
    return NextResponse.json({ error: 'Failed to create manual deposit' }, { status: 500 });
  }
}
