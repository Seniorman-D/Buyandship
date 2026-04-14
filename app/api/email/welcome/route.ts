import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'email and name required' }, { status: 400 });
    }
    const result = await sendWelcomeEmail(email, name);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
