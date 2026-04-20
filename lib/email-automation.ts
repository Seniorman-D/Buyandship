import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'BuyandShip Nigeria <admin@buyandshiptonigeria.com>';

export interface AutomationUser {
  id: string;
  email: string;
  full_name: string;
  nin_verified?: boolean;
}

function firstName(fullName: string) {
  return fullName.split(' ')[0];
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

// ─── TRACK A — Drip sequence scheduled on signup ────────────────────────────
// All 5 emails are pre-scheduled at once via Resend's scheduledAt.
// Each function still re-checks conditions at call time for immediate sends.
// Note: Resend scheduledAt requires a paid Resend plan.

export async function scheduleDripSequence(user: AutomationUser) {
  const name = firstName(user.full_name);

  const [
    HowToGuideEmail,
    VerifyIdentityEmail,
    NurtureValueEmail,
    NurtureObjectionsEmail,
    UrgencyEmail,
  ] = await Promise.all([
    import('@/emails/HowToGuideEmail').then((m) => m.HowToGuideEmail),
    import('@/emails/VerifyIdentityEmail').then((m) => m.VerifyIdentityEmail),
    import('@/emails/NurtureValueEmail').then((m) => m.NurtureValueEmail),
    import('@/emails/NurtureObjectionsEmail').then((m) => m.NurtureObjectionsEmail),
    import('@/emails/UrgencyEmail').then((m) => m.UrgencyEmail),
  ]);

  // Schedule all 5 emails in parallel (fire-and-forget)
  await Promise.allSettled([
    // scheduledAt is supported by the Resend API but not yet typed in v3 SDK — cast via any
    (resend.emails.send as any)({
      from: FROM,
      to: user.email,
      subject: '📦 Your complete guide to shipping from the US, UK & China',
      react: HowToGuideEmail({ firstName: name }),
      scheduledAt: daysFromNow(1),
    }),
    (resend.emails.send as any)({
      from: FROM,
      to: user.email,
      subject: `⚠️ ${name}, your account isn't fully activated yet`,
      react: VerifyIdentityEmail({ firstName: name }),
      scheduledAt: daysFromNow(2),
    }),
    (resend.emails.send as any)({
      from: FROM,
      to: user.email,
      subject: 'What ₦50,000 actually buys you on Amazon right now 👀',
      react: NurtureValueEmail({ firstName: name }),
      scheduledAt: daysFromNow(4),
    }),
    (resend.emails.send as any)({
      from: FROM,
      to: user.email,
      subject: 'The #1 fear people have about shipping from abroad (and the truth)',
      react: NurtureObjectionsEmail({ firstName: name }),
      scheduledAt: daysFromNow(7),
    }),
    (resend.emails.send as any)({
      from: FROM,
      to: user.email,
      subject: `${name}, this offer expires Friday 🕐`,
      react: UrgencyEmail({ firstName: name }),
      scheduledAt: daysFromNow(14),
    }),
  ]);
}

// ─── IMMEDIATE SENDS (condition-checked at call time) ────────────────────────

export async function sendWelcomeAutomation(user: AutomationUser) {
  const { WelcomeEmail } = await import('@/emails/WelcomeEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `🎉 Welcome ${firstName(user.full_name)} — your warehouse address is ready`,
    react: WelcomeEmail({ name: user.full_name }),
  }).catch(console.error);
}

export async function sendHowToGuideAutomation(user: AutomationUser) {
  const { count: shipCount } = await supabaseAdmin
    .from('shipping_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  const { count: procCount } = await supabaseAdmin
    .from('procurement_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  if ((shipCount ?? 0) > 0 || (procCount ?? 0) > 0) return;

  const { HowToGuideEmail } = await import('@/emails/HowToGuideEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: '📦 Your complete guide to shipping from the US, UK & China',
    react: HowToGuideEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

export async function sendVerifyIdentityAutomation(user: AutomationUser) {
  const { data: customer } = await supabaseAdmin
    .from('customers').select('nin_verified').eq('id', user.id).single();
  if (customer?.nin_verified) return;

  const { VerifyIdentityEmail } = await import('@/emails/VerifyIdentityEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `⚠️ ${firstName(user.full_name)}, your account isn't fully activated yet`,
    react: VerifyIdentityEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

export async function sendNurtureValueAutomation(user: AutomationUser) {
  const { count: shipCount } = await supabaseAdmin
    .from('shipping_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  const { count: procCount } = await supabaseAdmin
    .from('procurement_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  if ((shipCount ?? 0) > 0 || (procCount ?? 0) > 0) return;

  const { NurtureValueEmail } = await import('@/emails/NurtureValueEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'What ₦50,000 actually buys you on Amazon right now 👀',
    react: NurtureValueEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

export async function sendNurtureObjectionsAutomation(user: AutomationUser) {
  const { count: shipCount } = await supabaseAdmin
    .from('shipping_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  const { count: procCount } = await supabaseAdmin
    .from('procurement_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  if ((shipCount ?? 0) > 0 || (procCount ?? 0) > 0) return;

  const { NurtureObjectionsEmail } = await import('@/emails/NurtureObjectionsEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'The #1 fear people have about shipping from abroad (and the truth)',
    react: NurtureObjectionsEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

export async function sendUrgencyAutomation(user: AutomationUser) {
  const { count: shipCount } = await supabaseAdmin
    .from('shipping_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  const { count: procCount } = await supabaseAdmin
    .from('procurement_requests').select('id', { count: 'exact', head: true }).eq('customer_id', user.id);
  if ((shipCount ?? 0) > 0 || (procCount ?? 0) > 0) return;

  const { UrgencyEmail } = await import('@/emails/UrgencyEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `${firstName(user.full_name)}, this offer expires Friday 🕐`,
    react: UrgencyEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

// ─── TRACK B — Event-triggered ───────────────────────────────────────────────

export async function sendShipmentConfirmedAutomation(user: AutomationUser, trackingNumber?: string, requestId?: string) {
  const { ShipmentConfirmedEmail } = await import('@/emails/ShipmentConfirmedEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `🎉 We've got it, ${firstName(user.full_name)} — your shipment is in motion`,
    react: ShipmentConfirmedEmail({ firstName: firstName(user.full_name), trackingNumber, requestId }),
  }).catch(console.error);
}

export async function sendPostDeliveryAutomation(user: AutomationUser) {
  const { PostDeliveryEmail } = await import('@/emails/PostDeliveryEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `${firstName(user.full_name)}, how was your delivery? 🌟`,
    react: PostDeliveryEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}

export async function sendWinBackAutomation(user: AutomationUser) {
  const { WinBackEmail } = await import('@/emails/WinBackEmail');
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `${firstName(user.full_name)}, it's been a while 👋 — we kept your address warm`,
    react: WinBackEmail({ firstName: firstName(user.full_name) }),
  }).catch(console.error);
}
