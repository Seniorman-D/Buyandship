import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface ShipmentConfirmedEmailProps {
  firstName: string;
  trackingNumber?: string;
  requestId?: string;
}

export function ShipmentConfirmedEmail({ firstName, trackingNumber, requestId }: ShipmentConfirmedEmailProps) {
  const steps = [
    { n: '1', title: 'Package arrives at warehouse', body: 'You receive a WhatsApp + email notification with the confirmed weight and shipping cost.' },
    { n: '2', title: 'We consolidate & weigh', body: 'Your package is weighed precisely and the Nigeria-leg shipping cost is calculated.' },
    { n: '3', title: 'You pay via Paystack', body: 'A Paystack payment link is sent via WhatsApp. Pay in Naira by card or bank transfer.' },
    { n: '4', title: 'Delivered to your door', body: '7–14 business days (US/UK) or 14–21 days (China) from our warehouse.' },
  ];

  return (
    <BaseLayout preview={`Your shipment is in motion — here is what happens next.`}>
      <Heading style={h1}>It is happening, {firstName}! 📦✈️</Heading>
      <Text style={body}>
        We have received your shipping request. Here is exactly what happens next:
      </Text>

      {steps.map((s) => (
        <Section key={s.n} style={stepCard}>
          <Text style={stepNum}>{s.n}</Text>
          <Section style={{ flex: 1 }}>
            <Text style={stepTitle}>{s.title}</Text>
            <Text style={stepBody}>{s.body}</Text>
          </Section>
        </Section>
      ))}

      {(trackingNumber || requestId) && (
        <Section style={refBox}>
          {requestId && <Text style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}><strong>Request ID:</strong> {requestId}</Text>}
          {trackingNumber && <Text style={{ margin: 0, fontSize: '13px', color: '#374151' }}><strong>Tracking Number:</strong> {trackingNumber}</Text>}
        </Section>
      )}

      <Button href="https://buyandshiptonigeria.com/track" style={ctaButton}>
        Track My Shipment →
      </Button>

      <Text style={small}>
        Questions? WhatsApp us at <strong>08029155825</strong> — Mon–Fri, 9am–5pm WAT.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' };
const stepCard = { display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '14px', marginBottom: '10px' };
const stepNum = { backgroundColor: '#0A2540', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0, margin: 0 };
const stepTitle = { color: '#0A2540', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' };
const stepBody = { color: '#374151', fontSize: '13px', lineHeight: '1.5', margin: 0 };
const refBox = { backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '14px', margin: '16px 0' };
const ctaButton = { backgroundColor: '#1d4ed8', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '16px 0' };
const small = { color: '#6b7280', fontSize: '13px', margin: 0 };

export default ShipmentConfirmedEmail;
