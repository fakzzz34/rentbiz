/* File: app/api/categories/route.ts */
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
    // Kategori dibuat per pengguna, tapi bisa juga bersifat global
    // Di sini kita asumsikan per pengguna
    const categories = await kv.getByPrefix(`category_${user.id}_`);
    return NextResponse.json({ categories });
  } catch (error) {
    console.log('Get categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, icon, color } = await request.json();

    const categoryId = crypto.randomUUID();
    const categoryData = {
      id: categoryId,
      userId: user.id,
      name,
      description,
      icon,
      color,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`category_${user.id}_${categoryId}`, categoryData);

    return NextResponse.json({ success: true, category: categoryData });
  } catch (error) {
    console.log('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
