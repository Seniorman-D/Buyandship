import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationSubmissionEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const file = formData.get('file');

    if (!fullName || !email || !(file instanceof File)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large — max 5MB.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a JPG, PNG, or PDF.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await sendVerificationSubmissionEmail(
      String(fullName),
      String(email),
      phone ? String(phone) : '',
      { filename: file.name, content: buffer }
    );

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send submission. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Verification submission error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
