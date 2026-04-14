import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
}

export function IDVerifiedEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your identity has been verified – you can now submit shipping requests!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={badge}>
            <Text style={badgeText}>✓ IDENTITY VERIFIED</Text>
          </Section>
          <Heading style={h1}>You&apos;re Verified!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your identity has been successfully verified. You can now submit shipping and
            procurement requests on BuyandShip Nigeria.
          </Text>
          <Text style={text}>
            <strong>Ready to get started?</strong><br />
            • <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/ship-yourself`}>Submit a Shipping Request</Link><br />
            • <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/procure`}>Request Procurement Service</Link>
          </Text>
          <Hr style={hr} />
          <Text style={text}>
            Need help? WhatsApp: <Link href="https://wa.me/2348029155825">08029155825</Link>
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} BuyandShip Nigeria</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, Arial, sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', maxWidth: '600px' };
const badge = { backgroundColor: '#16a34a', padding: '12px', borderRadius: '8px', textAlign: 'center' as const, marginBottom: '16px' };
const badgeText = { color: '#ffffff', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px', margin: 0 };
const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold' };
const text = { color: '#374151', fontSize: '15px', lineHeight: '1.6' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default IDVerifiedEmail;
