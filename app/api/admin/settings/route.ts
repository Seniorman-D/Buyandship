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
  } catch {
    return false;
  }
}

// GET all settings
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin.from('settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });

  return NextResponse.json({ settings: map });
}

// POST — upsert all settings
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { settings } = body as { settings: Record<string, string> };

  if (!settings || typeof settings !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const upserts = Object.entries(settings)
    .filter(([key]) => key.trim())
    .map(([key, value]) => ({ key, value: String(value) }));

  const { error } = await supabaseAdmin.from('settings').upsert(upserts, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
