import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendShippingConfirmedEmail } from '@/lib/email';
import { isGadget } from '@/lib/rates';

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const {
      origin,
      itemName,
      trackingNumber,
      declaredValue,
      declaredCurrency,
      deliveryAddress,
      weightKg,
      customerName,
    } = body;

    // Validate required fields
    if (!origin || !itemName || !trackingNumber || !deliveryAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Policy checks
    if (origin === 'UK' && isGadget(itemName)) {
      return NextResponse.json({ error: 'Gadgets and electronics cannot be shipped from the UK.' }, { status: 400 });
    }

    // Get customer profile
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, full_name, email')
      .eq('id', user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    // Generate request ID
    const requestId = `BAS-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create shipping request
    const { data: shippingRequest, error } = await supabaseAdmin
      .from('shipping_requests')
      .insert({
        customer_id: user.id,
        origin,
        item_name: itemName,
        tracking_number: trackingNumber,
        declared_value: declaredValue ? parseFloat(declaredValue) : null,
        declared_currency: declaredCurrency,
        actual_weight_kg: weightKg ? parseFloat(weightKg) : null,
        delivery_address: deliveryAddress,
        status: 'pending',
        status_history: [{ status: 'pending', timestamp: new Date().toISOString() }],
      })
      .select()
      .single();

    if (error) {
      console.error('Shipping request insert error:', error);
      return NextResponse.json({ error: 'Failed to create shipping request' }, { status: 500 });
    }

    // Send confirmation email (non-blocking)
    sendShippingConfirmedEmail(
      customer.email,
      customer.full_name,
      requestId,
      trackingNumber,
      origin
    ).catch(console.error);

    return NextResponse.json({ id: shippingRequest.id, requestId });
  } catch (error) {
    console.error('Shipping route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data } = await supabase
      .from('shipping_requests')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ requests: data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
