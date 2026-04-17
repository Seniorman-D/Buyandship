import { NextRequest, NextResponse } from 'next/server';
import { verifyNIN } from '@/lib/prembly';
import { supabaseRoute } from '@/lib/supabase-route';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { nin } = await req.json();

    if (!nin || nin.length !== 11 || !/^\d{11}$/.test(nin)) {
      return NextResponse.json({ verified: false, error: 'Invalid NIN format. Must be 11 digits.' }, { status: 400 });
    }

    const result = await verifyNIN(nin);

    if (result.verified) {
      // Update / create the customer record if user is authenticated
      const supabase = supabaseRoute();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Enforce NIN uniqueness: check if this NIN is already registered to a DIFFERENT account
        const { data: existing } = await supabaseAdmin
          .from('customers')
          .select('id')
          .eq('nin', nin)
          .neq('id', user.id)
          .maybeSingle();

        if (existing) {
          return NextResponse.json(
            { verified: false, error: 'This NIN is already registered to another account. Each NIN can only be used once.' },
            { status: 409 }
          );
        }

        // Upsert so we create the row if it was never saved (pre-fix registrations)
        const meta = user.user_metadata || {};
        await supabaseAdmin
          .from('customers')
          .upsert(
            {
              id: user.id,
              full_name: (meta.full_name as string) || result.firstName || user.email || 'User',
              email: user.email!,
              phone: (meta.phone as string) || null,
              nin,
              nin_verified: true,
            },
            { onConflict: 'id' }
          );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('NIN verification route error:', error);
    return NextResponse.json({ verified: false, error: 'Service unavailable' }, { status: 500 });
  }
}
