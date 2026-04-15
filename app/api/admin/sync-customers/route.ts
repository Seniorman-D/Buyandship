import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseRoute } from '@/lib/supabase-route';

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

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all users from auth.users via admin API
  let allUsers: any[] = [];
  let page = 1;
  while (true) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !users?.length) break;
    allUsers = allUsers.concat(users);
    if (users.length < 1000) break;
    page++;
  }

  // Upsert each auth user into customers table (skipping admin-only accounts)
  let synced = 0;
  let skipped = 0;

  for (const user of allUsers) {
    // Skip users already in admins table
    const { data: adminRow } = await supabaseAdmin.from('admins').select('id').eq('id', user.id).single();
    if (adminRow) { skipped++; continue; }

    const meta = user.user_metadata || {};
    const { error } = await supabaseAdmin.from('customers').upsert(
      {
        id: user.id,
        full_name: meta.full_name || user.email?.split('@')[0] || 'Unknown',
        email: user.email || '',
        phone: meta.phone || null,
        nin_verified: false,
      },
      { onConflict: 'id', ignoreDuplicates: false }
    );

    if (!error) synced++;
    else console.error('Upsert error for', user.email, error.message);
  }

  return NextResponse.json({
    message: `Sync complete. ${synced} customers synced, ${skipped} admin accounts skipped.`,
    total: allUsers.length,
    synced,
    skipped,
  });
}
