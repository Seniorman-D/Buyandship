import { NextRequest, NextResponse } from 'next/server';
import { supabaseRoute } from '@/lib/supabase-route';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendProcurementReceivedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseRoute();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { origin, deliveryAddress, productLinks, notes } = body;

    if (!origin || !deliveryAddress || !productLinks || productLinks.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (productLinks.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 product links allowed' }, { status: 400 });
    }

    // Get or auto-create customer profile
    let { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, full_name, email')
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
        .select('id, full_name, email')
        .single();
      customer = created;
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    // Calculate initial estimate if prices provided
    const subtotal = productLinks.reduce(
      (sum: number, p: { estimatedPrice?: number; quantity?: number }) =>
        sum + (p.estimatedPrice || 0) * (p.quantity || 1),
      0
    );
    const procurementFee = subtotal * 0.05;
    const totalEstimate = subtotal + procurementFee;

    // Create procurement request
    const { data: procRequest, error } = await supabaseAdmin
      .from('procurement_requests')
      .insert({
        customer_id: user.id,
        origin,
        product_links: productLinks,
        estimated_cost: subtotal > 0 ? subtotal : null,
        procurement_fee: procurementFee > 0 ? procurementFee : null,
        total_estimate: totalEstimate > 0 ? totalEstimate : null,
        status: 'pending',
        status_history: [{ status: 'pending', timestamp: new Date().toISOString() }],
      })
      .select()
      .single();

    if (error) {
      console.error('Procurement request insert error:', error);
      return NextResponse.json({ error: 'Failed to create procurement request' }, { status: 500 });
    }

    // Send confirmation email (non-blocking)
    sendProcurementReceivedEmail(
      customer.email,
      customer.full_name,
      procRequest.id
    ).catch(console.error);

    return NextResponse.json({ id: procRequest.id });
  } catch (error) {
    console.error('Procurement route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
