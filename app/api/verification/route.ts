import { NextRequest, NextResponse } from 'next/server';
import { verifyNIN } from '@/lib/prembly';
import { sendVerificationSubmissionEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, nin } = await req.json();

    if (!fullName || !email || !phone || !nin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof nin !== 'string' || nin.length !== 11 || !/^\d{11}$/.test(nin)) {
      return NextResponse.json({ error: 'Invalid NIN format. Must be 11 digits.' }, { status: 400 });
    }

    const result = await verifyNIN(nin);

    if (!result.verified) {
      return NextResponse.json(
        { error: result.error || 'Verification failed. Please check your NIN and try again.' },
        { status: 400 }
      );
    }

    const verifiedName = `${result.firstName || ''} ${result.lastName || ''}`.trim();
    const emailResult = await sendVerificationSubmissionEmail(fullName, email, phone, nin, verifiedName);
    if (!emailResult.success) {
      console.error('Verification notification email failed:', emailResult.error);
    }

    return NextResponse.json({ success: true, firstName: result.firstName, lastName: result.lastName });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
