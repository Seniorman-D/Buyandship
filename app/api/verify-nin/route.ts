import { NextRequest, NextResponse } from 'next/server';
import { verifyNIN } from '@/lib/prembly';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { nin } = await req.json();

    if (!nin || nin.length !== 11 || !/^\d{11}$/.test(nin)) {
      return NextResponse.json({ verified: false, error: 'Invalid NIN format. Must be 11 digits.' }, { status: 400 });
    }

    const result = await verifyNIN(nin);

    if (result.verified) {
      // Update customer record if user is authenticated
      const supabase = supabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('customers')
          .update({ nin, nin_verified: true })
          .eq('id', user.id);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('NIN verification route error:', error);
    return NextResponse.json({ verified: false, error: 'Service unavailable' }, { status: 500 });
  }
}
