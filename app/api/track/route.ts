import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  // Search by tracking number or request ID
  const { data: byTracking } = await supabaseAdmin
    .from('shipping_requests')
    .select('id, item_name, origin, tracking_number, status, status_history, created_at, payment_status')
    .eq('tracking_number', q)
    .single();

  if (byTracking) {
    return NextResponse.json({ shipment: byTracking });
  }

  // Try by ID (UUID or partial match)
  const { data: byId } = await supabaseAdmin
    .from('shipping_requests')
    .select('id, item_name, origin, tracking_number, status, status_history, created_at, payment_status')
    .eq('id', q)
    .single();

  if (byId) {
    return NextResponse.json({ shipment: byId });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
