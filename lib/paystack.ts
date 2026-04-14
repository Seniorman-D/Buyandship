// TODO: Ensure PAYSTACK_SECRET_KEY is regenerated and set in Netlify dashboard before launch
// Webhook URL must be set to: https://buyandshiptonigeria.com/api/payment/verify

export interface PaystackInitParams {
  email: string;
  amountKobo: number;
  reference: string;
  metadata: Record<string, unknown>;
}

export interface PaystackInitResult {
  authorization_url: string;
  reference: string;
}

export interface PaystackVerifyResult {
  paid: boolean;
  amount: number;
  email: string;
}

export async function initializePaystackPayment(
  params: PaystackInitParams
): Promise<PaystackInitResult> {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      metadata: params.metadata,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
    }),
  });

  const data = await res.json();

  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize payment');
  }

  return {
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  };
}

export async function verifyPaystackPayment(reference: string): Promise<PaystackVerifyResult> {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );

  const data = await res.json();

  return {
    paid: data.data?.status === 'success',
    amount: data.data?.amount / 100,
    email: data.data?.customer?.email,
  };
}

export function generateReference(prefix: string = 'BAS'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
