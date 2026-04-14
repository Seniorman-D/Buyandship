import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'BuyandShip Nigeria <noreply@buyandshiptonigeria.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@buyandshiptonigeria.com';

export interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<EmailResult> {
  try {
    const { WelcomeEmail } = await import('@/emails/WelcomeEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to BuyandShip Nigeria – Your Warehouse Addresses',
      react: WelcomeEmail({ name }),
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendShippingConfirmedEmail(
  to: string,
  name: string,
  requestId: string,
  trackingNumber: string,
  origin: string
): Promise<EmailResult> {
  try {
    const { ShippingConfirmedEmail } = await import('@/emails/ShippingConfirmedEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Shipping Request Confirmed – ${requestId}`,
      react: ShippingConfirmedEmail({ name, requestId, trackingNumber, origin }),
    });
    return { success: true };
  } catch (error) {
    console.error('Shipping confirmed email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendProcurementReceivedEmail(
  to: string,
  name: string,
  requestId: string
): Promise<EmailResult> {
  try {
    const { ProcurementReceivedEmail } = await import('@/emails/ProcurementReceivedEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Procurement Request Received – ${requestId}`,
      react: ProcurementReceivedEmail({ name, requestId }),
    });
    return { success: true };
  } catch (error) {
    console.error('Procurement received email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendStatusUpdateEmail(
  to: string,
  name: string,
  requestId: string,
  status: string,
  statusLabel: string
): Promise<EmailResult> {
  try {
    const { StatusUpdateEmail } = await import('@/emails/StatusUpdateEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Update on Your Shipment – ${statusLabel}`,
      react: StatusUpdateEmail({ name, requestId, status, statusLabel }),
    });
    return { success: true };
  } catch (error) {
    console.error('Status update email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendProcurementEstimateEmail(
  to: string,
  name: string,
  requestId: string,
  items: Array<{ name: string; price: number; currency: string }>,
  procurementFee: number,
  total: number,
  currency: string,
  paymentUrl: string
): Promise<EmailResult> {
  try {
    const { ProcurementEstimateEmail } = await import('@/emails/ProcurementEstimateEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Cost Estimate for Your Procurement – ${requestId}`,
      react: ProcurementEstimateEmail({ name, requestId, items, procurementFee, total, currency, paymentUrl }),
    });
    return { success: true };
  } catch (error) {
    console.error('Procurement estimate email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendShippingInvoiceEmail(
  to: string,
  name: string,
  requestId: string,
  amount: number,
  currency: string,
  paymentUrl: string
): Promise<EmailResult> {
  try {
    const { ShippingInvoiceEmail } = await import('@/emails/ShippingInvoiceEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Invoice Ready – Pay Now for Shipment ${requestId}`,
      react: ShippingInvoiceEmail({ name, requestId, amount, currency, paymentUrl }),
    });
    return { success: true };
  } catch (error) {
    console.error('Shipping invoice email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendPaymentConfirmedEmail(
  to: string,
  name: string,
  requestId: string,
  amount: number,
  currency: string
): Promise<EmailResult> {
  try {
    const { PaymentConfirmedEmail } = await import('@/emails/PaymentConfirmedEmail');

    // Send to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Payment Confirmed – ${requestId}`,
      react: PaymentConfirmedEmail({ name, requestId, amount, currency }),
    });

    // Notify admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[ADMIN] Payment Received – ${requestId} – ${currency}${amount}`,
      react: PaymentConfirmedEmail({ name, requestId, amount, currency, isAdmin: true }),
    });

    return { success: true };
  } catch (error) {
    console.error('Payment confirmed email error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendIDVerifiedEmail(to: string, name: string): Promise<EmailResult> {
  try {
    const { IDVerifiedEmail } = await import('@/emails/IDVerifiedEmail');
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Identity Verified – You Can Now Submit Requests',
      react: IDVerifiedEmail({ name }),
    });
    return { success: true };
  } catch (error) {
    console.error('ID verified email error:', error);
    return { success: false, error: String(error) };
  }
}
