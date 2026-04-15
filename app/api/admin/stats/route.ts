import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseRoute } from '@/lib/supabase-route';

async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const supabase = supabaseRoute();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data } = await supabaseAdmin.from('admins').select('id').eq('id', session.user.id).single();
    return !!data;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [cust, ship, proc, pendingPay, recentShip] = await Promise.all([
    supabaseAdmin.from('customers').select('id', { count: 'exact' }),
    supabaseAdmin.from('shipping_requests').select('id', { count: 'exact' }),
    supabaseAdmin.from('procurement_requests').select('id', { count: 'exact' }),
    supabaseAdmin.from('shipping_requests').select('id', { count: 'exact' }).eq('payment_status', 'unpaid'),
    supabaseAdmin
      .from('shipping_requests')
      .select('id,item_name,origin,status,payment_status,created_at,customers(full_name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return NextResponse.json({
    stats: {
      totalCustomers: cust.count || 0,
      totalShipping: ship.count || 0,
      totalProcurement: proc.count || 0,
      pendingPayments: pendingPay.count || 0,
    },
    recentShipping: recentShip.data || [],
  });
}
