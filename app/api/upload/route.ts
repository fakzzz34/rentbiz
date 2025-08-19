// File: app/api/upload/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';

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
  if (!token) return null;
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

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
  const user = await verifyAuth(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    // Menghasilkan nama file unik dengan userID dan UUID
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    // Unggah file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('rental-images') // Pastikan bucket ini ada di Supabase
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Mendapatkan URL publik dari file yang baru diunggah
    const { data: publicUrlData } = supabase.storage
      .from('rental-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
