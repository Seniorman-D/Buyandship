import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  requestId: string;
}

export function ProcurementReceivedEmail({ name, requestId }: Props) {
  return (
    <Html>
      <Head />
      <Preview>We received your procurement request – expect a response within 24 hours</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Procurement Request Received!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We&apos;ve received your procurement request <strong>{requestId}</strong>.
            Our team will review your product links and send you a cost estimate within{' '}
            <strong>24 hours</strong>.
          </Text>
          <Section style={infoBox}>
            <Text style={infoRow}><strong>Request ID:</strong> {requestId}</Text>
            <Text style={infoRow}><strong>Status:</strong> Under Review</Text>
            <Text style={infoRow}><strong>Expected Response:</strong> Within 24 hours</Text>
          </Section>
          <Text style={text}>
            <strong>What happens next?</strong><br />
            1. Our team reviews your product links and checks prices<br />
            2. We send you an itemised cost estimate including our 5% procurement fee<br />
            3. You approve and pay via Paystack<br />
            4. We purchase the items and ship to Nigeria on your behalf
          </Text>
          <Text style={text}>
            In a hurry? Chat with us on WhatsApp:{' '}
            <Link href="https://wa.me/2348029155825">08029155825</Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© {new Date().getFullYear()} BuyandShip Nigeria. Shop Anywhere. Ship to Nigeria.</Text>
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

export default ProcurementReceivedEmail;
