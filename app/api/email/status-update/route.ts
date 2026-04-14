import { NextRequest, NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email';
import { STATUS_LABELS } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { requestId, status, customerEmail, customerName } = await req.json();
    if (!requestId || !status || !customerEmail || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const statusLabel = STATUS_LABELS[status] || status;
    const result = await sendStatusUpdateEmail(customerEmail, customerName, requestId, status, statusLabel);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
