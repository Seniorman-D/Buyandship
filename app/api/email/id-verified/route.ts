import { NextRequest, NextResponse } from 'next/server';
import { sendIDVerifiedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'email and name required' }, { status: 400 });
    }
    const result = await sendIDVerifiedEmail(email, name);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
