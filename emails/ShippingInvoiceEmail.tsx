import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  requestId: string;
  amount: number;
  currency: string;
  paymentUrl: string;
}

export function ShippingInvoiceEmail({ name, requestId, amount, currency, paymentUrl }: Props) {
  const symbol = currency === 'GBP' ? '£' : '$';

  return (
    <Html>
      <Head />
      <Preview>Invoice Ready – Pay {symbol}{amount.toFixed(2)} for your shipment</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Shipping Invoice is Ready</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We&apos;ve received and weighed your shipment <strong>{requestId}</strong>.
            Please pay your shipping invoice to proceed.
          </Text>
          <Section style={invoiceBox}>
            <Text style={invoiceLabel}>Amount Due</Text>
            <Text style={invoiceAmount}>{symbol}{amount.toFixed(2)}</Text>
            <Text style={invoiceCurrency}>Shipping Cost ({currency})</Text>
          </Section>
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button href={paymentUrl} style={button}>
              Pay Now – {symbol}{amount.toFixed(2)}
            </Button>
          </Section>
          <Text style={text}>
            Payment is processed securely via Paystack. Your item will be dispatched to Nigeria
            once payment is confirmed.
          </Text>
          <Hr style={hr} />
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
const invoiceBox = { backgroundColor: '#0A2540', padding: '32px', borderRadius: '8px', textAlign: 'center' as const, marginBottom: '16px' };
const invoiceLabel = { color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 8px' };
const invoiceAmount = { color: '#F97316', fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px' };
const invoiceCurrency = { color: '#cbd5e1', fontSize: '14px', margin: 0 };
const button = { backgroundColor: '#F97316', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default ShippingInvoiceEmail;
