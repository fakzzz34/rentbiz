/* File: app/api/items/route.ts */
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
    const items = await kv.getByPrefix(`rental_item_${user.id}_`);
    return NextResponse.json({ items });
  } catch (error) {
    console.log('Get items error:', error);
    return NextResponse.json({ error: 'Failed to fetch rental items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, category, description, pricePerHour, pricePerDay, totalUnits, image } = await request.json();

    const itemId = crypto.randomUUID();
    const itemData = {
      id: itemId,
      userId: user.id,
      name,
      category,
      description,
      pricePerHour: parseFloat(pricePerHour),
      pricePerDay: parseFloat(pricePerDay),
      totalUnits: parseInt(totalUnits),
      availableUnits: parseInt(totalUnits),
      status: 'available',
      image: image || 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b2b5?w=300&h=200&fit=crop',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`rental_item_${user.id}_${itemId}`, itemData);

    return NextResponse.json({ success: true, item: itemData });
  } catch (error) {
    console.log('Create item error:', error);
    return NextResponse.json({ error: 'Failed to create rental item' }, { status: 500 });
  }
}
