/* File: app/api/signup/route.ts */
import { createClient } from "@supabase/supabase-js";
import * as kv from "@/app/lib/kv_store";
import { NextResponse } from 'next/server';

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, name, role, businessType } = await request.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role,
        business_type: businessType
      },
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Simpan data pengguna tambahan di KV store
    await kv.set(`user_${data.user.id}`, {
      name,
      role,
      businessType,
      created_at: new Date().toISOString(),
      status: 'active'
    });

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Signup failed' }, { status: 500 });
  }
}
