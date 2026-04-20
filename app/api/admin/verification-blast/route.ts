import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseRoute } from '@/lib/supabase-route';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'BuyandShip Nigeria <admin@buyandshiptonigeria.com>';

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = supabaseRoute();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data } = await supabaseAdmin.from('admins').select('id').eq('id', session.user.id).single();
    return !!data;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const dryRun = body.dryRun === true;

  // Fetch all unverified customers (no NIN, no activity blocker)
  const { data: customers, error } = await supabaseAdmin
    .from('customers')
    .select('id, full_name, email, nin_verified')
    .or('nin_verified.is.null,nin_verified.eq.false')
    .not('email', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const targets = customers || [];
  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      count: targets.length,
      emails: targets.map((c) => c.email),
    });
  }

  // Send in batches of 50 (Resend batch limit is 100; we use 50 to be safe)
  const BATCH = 50;
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  const { VerifyIdentityEmail } = await import('@/emails/VerifyIdentityEmail');

  for (let i = 0; i < targets.length; i += BATCH) {
    const chunk = targets.slice(i, i + BATCH);
    const messages = chunk.map((c) => ({
      from: FROM,
      to: c.email,
      subject: `⚠️ ${c.full_name.split(' ')[0]}, your BuyandShip account isn't fully activated yet`,
      react: VerifyIdentityEmail({ firstName: c.full_name.split(' ')[0] }),
    }));

    try {
      const result = await resend.batch.send(messages);
      if (Array.isArray(result.data)) {
        sent += result.data.length;
      } else {
        sent += chunk.length;
      }
    } catch (err: any) {
      failed += chunk.length;
      errors.push(err?.message || String(err));
    }
  }

  return NextResponse.json({
    total: targets.length,
    sent,
    failed,
    errors: errors.length ? errors : undefined,
  });
}
