import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  requestId: string;
  amount: number;
  currency: string;
  isAdmin?: boolean;
}

export function PaymentConfirmedEmail({ name, requestId, amount, currency, isAdmin = false }: Props) {
  const symbol = currency === 'GBP' ? '£' : currency === 'NGN' ? '₦' : '$';

  if (isAdmin) {
    return (
      <Html>
        <Head />
        <Preview>[ADMIN] Payment received for {requestId}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>[ADMIN] Payment Received</Heading>
            <Text style={text}>A payment has been confirmed.</Text>
            <Section style={infoBox}>
              <Text style={infoRow}><strong>Customer:</strong> {name}</Text>
              <Text style={infoRow}><strong>Request ID:</strong> {requestId}</Text>
              <Text style={infoRow}><strong>Amount:</strong> {symbol}{amount.toFixed(2)} {currency}</Text>
            </Section>
            <Text style={text}>Please update the shipment status accordingly in the admin dashboard.</Text>
            <Text style={footer}>BuyandShip Nigeria Admin Notification</Text>
          </Container>
        </Body>
      </Html>
    );
  }

  return (
    <Html>
      <Head />
      <Preview>Payment Confirmed – {requestId} – Thank you!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Confirmed!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We&apos;ve received your payment for shipment <strong>{requestId}</strong>. Thank you!
          </Text>
          <Section style={infoBox}>
            <Text style={infoRow}><strong>Request ID:</strong> {requestId}</Text>
            <Text style={infoRow}><strong>Amount Paid:</strong> {symbol}{amount.toFixed(2)}</Text>
            <Text style={infoRow}><strong>Status:</strong> Processing</Text>
          </Section>
          <Text style={text}>
            Your item will be processed and shipped to Nigeria shortly. We&apos;ll send you
            tracking updates at every step.
          </Text>
          <Hr style={hr} />
          <Text style={text}>
            Track your shipment: <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/track`}>buyandshiptonigeria.com/track</Link>
          </Text>
          <Text style={text}>
            Questions? WhatsApp: <Link href="https://wa.me/2348029155825">08029155825</Link>
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} BuyandShip Nigeria</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, Arial, sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', maxWidth: '600px' };
const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold' };
const text = { color: '#374151', fontSize: '15px', lineHeight: '1.6' };
const infoBox = { backgroundColor: '#f0f9f0', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '4px', marginBottom: '16px' };
const infoRow = { color: '#374151', fontSize: '14px', margin: '4px 0' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default PaymentConfirmedEmail;
