/* File: app/api/operators/[id]/route.ts */
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user || user.user_metadata.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 401 });
  }

  try {
    const operatorId = params.id;
    const updates = await request.json();

    const userData = await kv.get(`user_${operatorId}`) || {};
    const updatedData = { ...userData, ...updates };

    await kv.set(`user_${operatorId}`, updatedData);

    return NextResponse.json({ success: true, operator: updatedData });
  } catch (error) {
    console.log('Update operator error:', error);
    return NextResponse.json({ error: 'Failed to update operator' }, { status: 500 });
  }
}
