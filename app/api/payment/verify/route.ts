import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackPayment } from '@/lib/paystack';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPaymentConfirmedEmail } from '@/lib/email';

// This route handles both:
// 1. GET: Paystack redirect callback (user comes back from Paystack)
// 2. POST: Paystack webhook (Paystack posts to this URL on payment events)
// Webhook URL must be set at: https://dashboard.paystack.com > Settings > API Keys & Webhooks

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
  }

  return verifyAndUpdate(reference);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Paystack webhook payload
    if (body.event === 'charge.success') {
      const reference = body.data?.reference;
      if (reference) {
        await verifyAndUpdate(reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function verifyAndUpdate(reference: string) {
  try {
    const result = await verifyPaystackPayment(reference);

    if (!result.paid) {
      return NextResponse.json({ paid: false, error: 'Payment not confirmed by Paystack' });
    }

    // Find which table has this reference
    // Check shipping_requests first
    const { data: shipping } = await supabaseAdmin
      .from('shipping_requests')
      .select('id, customer_id, item_name, estimated_cost, estimated_currency, customers(full_name, email)')
      .eq('paystack_reference', reference)
      .single();

    if (shipping) {
      await supabaseAdmin
        .from('shipping_requests')
        .update({ payment_status: 'paid', paystack_reference: reference })
        .eq('id', shipping.id);

      const customer = (shipping as any).customers;
      if (customer) {
        sendPaymentConfirmedEmail(
          customer.email,
          customer.full_name,
          shipping.id,
          shipping.estimated_cost || result.amount,
          shipping.estimated_currency || 'USD'
        ).catch(console.error);
      }

      return NextResponse.json({ paid: true, amount: result.amount, type: 'shipping' });
    }

    // Check procurement_requests
    const { data: procurement } = await supabaseAdmin
      .from('procurement_requests')
      .select('id, customer_id, total_estimate, customers(full_name, email)')
      .eq('paystack_reference', reference)
      .single();

    if (procurement) {
      await supabaseAdmin
        .from('procurement_requests')
        .update({ payment_status: 'paid', paystack_reference: reference })
        .eq('id', procurement.id);

      const customer = (procurement as any).customers;
      if (customer) {
        sendPaymentConfirmedEmail(
          customer.email,
          customer.full_name,
          procurement.id,
          procurement.total_estimate || result.amount,
          'USD'
        ).catch(console.error);
      }

      return NextResponse.json({ paid: true, amount: result.amount, type: 'procurement' });
    }

    // Reference not matched to any request yet — store for later matching
    // This can happen when webhook fires before the reference is saved
    return NextResponse.json({ paid: true, amount: result.amount, note: 'Payment confirmed, reference not yet matched' });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
