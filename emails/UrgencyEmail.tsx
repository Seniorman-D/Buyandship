import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface UrgencyEmailProps {
  firstName: string;
}

export function UrgencyEmail({ firstName }: UrgencyEmailProps) {
  return (
    <BaseLayout preview="Free shipping on your first US package under 2lbs. No code needed.">
      <Heading style={h1}>Last push, {firstName} — and it is a good one.</Heading>
      <Text style={body}>
        You signed up a while back but have not shipped yet. We want to make your first shipment
        as easy as possible — so here is an offer to get you started.
      </Text>

      <Section style={offerBox}>
        <Text style={offerTitle}>🎁 First Shipment Offer</Text>
        <Text style={offerBody}>
          Ship your first US package under 2lbs and we cover the shipping cost to Nigeria.
        </Text>
        <Text style={offerDetails}>
          ✅ No promo code needed<br />
          ✅ No form to fill<br />
          ✅ Applied automatically on your first request<br />
          ⏰ <strong>Expires: This Friday at midnight</strong>
        </Text>
      </Section>

      <Text style={body}>Here is how to claim it:</Text>
      <Text style={{ ...body, paddingLeft: '8px' }}>
        1. Shop on any US store (Amazon, Walmart, eBay, etc.)<br />
        2. Ship to your BuyandShip US warehouse address<br />
        3. Submit a Shipping Request in your dashboard<br />
        4. We handle the rest — for free.
      </Text>

      <Button href="https://buyandshiptonigeria.com/ship-yourself" style={ctaButton}>
        Claim My Free Shipment →
      </Button>

      <Text style={small}>
        Need help getting started? WhatsApp us at <strong>08029155825</strong> and we will walk you
        through it in under 5 minutes.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const offerBox = { backgroundColor: '#fffbeb', border: '2px solid #f59e0b', borderRadius: '10px', padding: '20px 24px', margin: '0 0 24px' };
const offerTitle = { fontWeight: 'bold', fontSize: '18px', color: '#92400e', margin: '0 0 8px' };
const offerBody = { fontSize: '15px', color: '#374151', margin: '0 0 12px', lineHeight: '1.5' };
const offerDetails = { fontSize: '14px', color: '#374151', lineHeight: '1.8', margin: 0 };
const ctaButton = { backgroundColor: '#0A2540', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '0 0 20px' };
const small = { color: '#6b7280', fontSize: '13px', margin: 0 };

export default UrgencyEmail;
