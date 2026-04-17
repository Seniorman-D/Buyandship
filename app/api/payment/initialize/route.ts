import { NextRequest, NextResponse } from 'next/server';
import { supabaseRoute } from '@/lib/supabase-route';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { initializePaystackPayment, generateReference } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

async function getFxRates(): Promise<Record<string, number>> {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('key, value')
    .in('key', ['usd_to_ngn', 'gbp_to_ngn']);

  const map: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });

  return {
    USD: parseFloat(map.usd_to_ngn || '1600'),
    GBP: parseFloat(map.gbp_to_ngn || '2050'),
    NGN: 1,
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseRoute();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { requestId, requestType } = await req.json();

    if (!requestId || !requestType) {
      return NextResponse.json({ error: 'Missing requestId or requestType' }, { status: 400 });
    }

    // Get or auto-create customer profile
    let { data: customer } = await supabaseAdmin
      .from('customers')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    if (!customer) {
      const meta = user.user_metadata || {};
      const { data: created } = await supabaseAdmin
        .from('customers')
        .upsert(
          {
            id: user.id,
            full_name: (meta.full_name as string) || user.email || 'User',
            email: user.email!,
            phone: (meta.phone as string) || null,
          },
          { onConflict: 'id' }
        )
        .select('email, full_name')
        .single();
      customer = created;
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const FX_RATES_TO_NGN = await getFxRates();

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
