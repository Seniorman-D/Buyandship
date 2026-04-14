import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  requestId: string;
  status: string;
  statusLabel: string;
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
  received_at_warehouse: 'Your item has arrived at our warehouse and is being processed.',
  in_transit: 'Your item has departed and is currently in transit to Nigeria.',
  out_for_delivery: 'Your item is out for delivery and will reach you today or tomorrow.',
  delivered: 'Your item has been delivered. Thank you for shipping with us!',
};

export function StatusUpdateEmail({ name, requestId, status, statusLabel }: Props) {
  const description = STATUS_DESCRIPTIONS[status] || 'Your shipment status has been updated.';

  return (
    <Html>
      <Head />
      <Preview>Shipment Update: {statusLabel} – {requestId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Shipment Status Update</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            There&apos;s a new update on your shipment <strong>{requestId}</strong>.
          </Text>
          <Section style={statusBox}>
            <Text style={statusLabel_style}>Current Status</Text>
            <Text style={statusValue}>{statusLabel}</Text>
            <Text style={statusDesc}>{description}</Text>
          </Section>
          <Text style={text}>
            Track your shipment live:{' '}
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/track`}>
              buyandshiptonigeria.com/track
            </Link>
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
const statusBox = { backgroundColor: '#0A2540', padding: '24px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' as const };
const statusLabel_style = { color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 4px' };
const statusValue = { color: '#F97316', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' };
const statusDesc = { color: '#cbd5e1', fontSize: '14px', margin: 0 };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default StatusUpdateEmail;
