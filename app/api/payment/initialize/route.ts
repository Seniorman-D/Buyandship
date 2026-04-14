import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { initializePaystackPayment, generateReference } from '@/lib/paystack';

// Exchange rates — update regularly or fetch from an FX API
const FX_RATES_TO_NGN: Record<string, number> = {
  USD: 1600,
  GBP: 2050,
  NGN: 1,
};

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { requestId, requestType } = await req.json();

    if (!requestId || !requestType) {
      return NextResponse.json({ error: 'Missing requestId or requestType' }, { status: 400 });
    }

    // Get customer email
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    let amountNGN = 0;
    let metadata: Record<string, unknown> = {};

    if (requestType === 'shipping') {
      const { data: request } = await supabaseAdmin
        .from('shipping_requests')
        .select('id, estimated_cost, estimated_currency, item_name')
        .eq('id', requestId)
        .eq('customer_id', user.id)
        .single();

      if (!request || !request.estimated_cost) {
        return NextResponse.json({ error: 'Shipping request not found or no cost set' }, { status: 404 });
      }

      const rate = FX_RATES_TO_NGN[request.estimated_currency] || FX_RATES_TO_NGN.USD;
      amountNGN = Math.round(request.estimated_cost * rate);
      metadata = {
        type: 'shipping',
        requestId,
        itemName: request.item_name,
        customerName: customer.full_name,
      };
    } else if (requestType === 'procurement') {
      const { data: request } = await supabaseAdmin
        .from('procurement_requests')
        .select('id, total_estimate')
        .eq('id', requestId)
        .eq('customer_id', user.id)
        .single();

      if (!request || !request.total_estimate) {
        return NextResponse.json({ error: 'Procurement request not found or no estimate set' }, { status: 404 });
      }

      amountNGN = Math.round(request.total_estimate * FX_RATES_TO_NGN.USD);
      metadata = {
        type: 'procurement',
        requestId,
        customerName: customer.full_name,
      };
    } else {
      return NextResponse.json({ error: 'Invalid requestType' }, { status: 400 });
    }

    const reference = generateReference('BAS');

    const { authorization_url } = await initializePaystackPayment({
      email: customer.email,
      amountKobo: amountNGN * 100, // Paystack uses kobo (1 NGN = 100 kobo)
      reference,
      metadata,
    });

    return NextResponse.json({ authorization_url, reference });
  } catch (error) {
    console.error('Payment initialize error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
