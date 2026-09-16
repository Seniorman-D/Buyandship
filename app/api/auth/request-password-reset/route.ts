import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, redirectTo } = await req.json();

    if (!email || !redirectTo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    // Always respond success — never reveal whether an email is registered.
    if (error || !data.properties?.action_link) {
      console.error('generateLink error:', error);
      return NextResponse.json({ success: true });
    }

    let name = (data.user?.user_metadata as { full_name?: string } | null)?.full_name;

    if (!name) {
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('full_name')
        .eq('id', data.user!.id)
        .single();
      name = customer?.full_name;
    }

    if (!name) {
      const { data: admin } = await supabaseAdmin
        .from('admins')
        .select('full_name')
        .eq('id', data.user!.id)
        .single();
      name = admin?.full_name;
    }

    await sendPasswordResetEmail(email, name || 'there', data.properties.action_link);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Request password reset exception:', err);
    return NextResponse.json({ success: true });
  }
}
