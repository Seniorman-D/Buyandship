import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Row, Section, Text,
} from '@react-email/components';

interface Item {
  name: string;
  price: number;
  currency: string;
}

interface Props {
  name: string;
  requestId: string;
  items: Item[];
  procurementFee: number;
  total: number;
  currency: string;
  paymentUrl: string;
}

export function ProcurementEstimateEmail({
  name, requestId, items, procurementFee, total, currency, paymentUrl,
}: Props) {
  const symbol = currency === 'GBP' ? '£' : '$';

  return (
    <Html>
      <Head />
      <Preview>Your procurement cost estimate is ready – {requestId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Procurement Cost Estimate</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your cost estimate for procurement request <strong>{requestId}</strong> is ready.
            Please review and proceed to payment to confirm your order.
          </Text>

          <Section style={tableContainer}>
            <Row style={tableHeader}>
              <Text style={th}>Item</Text>
              <Text style={th}>Cost</Text>
            </Row>
            {items.map((item, i) => (
              <Row key={i} style={tableRow}>
                <Text style={td}>{item.name}</Text>
                <Text style={td}>{symbol}{item.price.toFixed(2)}</Text>
              </Row>
            ))}
            <Row style={tableRow}>
              <Text style={td}>Procurement Fee (5%)</Text>
              <Text style={td}>{symbol}{procurementFee.toFixed(2)}</Text>
            </Row>
            <Row style={totalRow}>
              <Text style={totalLabel}>Total</Text>
              <Text style={totalValue}>{symbol}{total.toFixed(2)}</Text>
            </Row>
          </Section>

          <Text style={text}>
            This estimate includes product cost + our 5% procurement service fee.
            Shipping cost from our warehouse to Nigeria will be invoiced separately after weighing.
          </Text>

          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button href={paymentUrl} style={button}>Pay Now – {symbol}{total.toFixed(2)}</Button>
          </Section>

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
const tableContainer = { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' };
const tableHeader = { backgroundColor: '#0A2540', padding: '10px 16px' };
const tableRow = { borderBottom: '1px solid #e5e7eb', padding: '10px 16px' };
const th = { color: '#ffffff', fontSize: '13px', fontWeight: 'bold', margin: 0 };
const td = { color: '#374151', fontSize: '14px', margin: 0 };
const totalRow = { backgroundColor: '#f0f4f8', padding: '12px 16px' };
const totalLabel = { color: '#0A2540', fontWeight: 'bold', fontSize: '15px', margin: 0 };
const totalValue = { color: '#F97316', fontWeight: 'bold', fontSize: '18px', margin: 0 };
const button = { backgroundColor: '#F97316', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default ProcurementEstimateEmail;
