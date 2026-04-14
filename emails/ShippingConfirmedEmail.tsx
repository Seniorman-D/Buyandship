import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  requestId: string;
  trackingNumber: string;
  origin: string;
}

export function ShippingConfirmedEmail({ name, requestId, trackingNumber, origin }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your shipping request has been confirmed – {requestId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Shipping Request Confirmed!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We&apos;ve received your shipping request. Here are the details:
          </Text>
          <Section style={infoBox}>
            <Text style={infoRow}><strong>Request ID:</strong> {requestId}</Text>
            <Text style={infoRow}><strong>Tracking Number:</strong> {trackingNumber}</Text>
            <Text style={infoRow}><strong>Origin:</strong> {origin}</Text>
            <Text style={infoRow}><strong>Status:</strong> Pending</Text>
          </Section>
          <Text style={text}>
            <strong>What happens next?</strong><br />
            1. We&apos;ll receive your item at our {origin} warehouse<br />
            2. We&apos;ll weigh and measure your package<br />
            3. We&apos;ll send you an invoice for the shipping cost<br />
            4. After payment, your item ships to Nigeria within 7–14 business days
          </Text>
          <Text style={text}>
            Track your shipment anytime at:{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/track`}>
              buyandshiptonigeria.com/track
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={text}>
            Questions? WhatsApp us: <Link href="https://wa.me/2348029155825">08029155825</Link>
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
const infoBox = { backgroundColor: '#f0f4f8', padding: '16px', borderRadius: '4px', marginBottom: '16px' };
const infoRow = { color: '#374151', fontSize: '14px', margin: '4px 0' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default ShippingConfirmedEmail;
