import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseRoute } from '@/lib/supabase-route';

export const dynamic = 'force-dynamic';

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = supabaseRoute();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    const { data } = await supabaseAdmin.from('admins').select('id').eq('id', session.user.id).single();
    return !!data;
  } catch { return false; }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('nin_verified', false)
    .not('id_document_url', 'is', null)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data || [] });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, nin_verified } = await req.json();
  const { error } = await supabaseAdmin
    .from('customers')
    .update({ nin_verified })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
