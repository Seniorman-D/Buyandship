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

// Track A — drip sequence triggered on signup
// Each function checks conditions before sending (fire-and-forget pattern)

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

// Track B — triggered by events

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
