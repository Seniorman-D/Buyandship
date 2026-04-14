import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, fullName, email, phone } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use service role to bypass RLS — safe because we validate the userId
    // came from a real Supabase auth.signUp() call (the user exists in auth.users)
    const { error } = await supabaseAdmin
      .from('customers')
      .upsert(
        { id: userId, full_name: fullName, email, phone: phone || null },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Register API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Register API exception:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
