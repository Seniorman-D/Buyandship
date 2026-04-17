import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseRoute } from '@/lib/supabase-route';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = supabaseRoute();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data } = await supabaseAdmin.from('admins').select('id').eq('id', session.user.id).single();
    return !!data;
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '0');

  const { data, count, error } = await supabaseAdmin
    .from('shipping_requests')
    .select('id,item_name,estimated_cost,estimated_currency,payment_status,paystack_reference,customers(full_name,email),created_at', { count: 'exact' })
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data || [], total: count || 0 });
}
