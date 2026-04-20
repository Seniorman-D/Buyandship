import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeAutomation, scheduleDripSequence } from '@/lib/email-automation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId, fullName, email, phone } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // Fire welcome email immediately, then schedule the full drip sequence (non-blocking)
    const automationUser = { id: userId, email, full_name: fullName };
    sendWelcomeAutomation(automationUser).catch(console.error);
    scheduleDripSequence(automationUser).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Register API exception:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
