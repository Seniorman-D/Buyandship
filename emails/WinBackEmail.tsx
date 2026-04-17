import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface WinBackEmailProps {
  firstName: string;
}

export function WinBackEmail({ firstName }: WinBackEmailProps) {
  return (
    <BaseLayout preview="Your warehouse is still active. And we have something for you.">
      <Heading style={h1}>We did not forget you, {firstName} 🙂</Heading>
      <Text style={body}>
        It has been a while since we last saw you — but your BuyandShip Nigeria account is still
        active and your personal warehouse addresses in the US, UK, and China are still yours.
      </Text>
      <Text style={body}>
        Thousands of Nigerians have shipped with us since you signed up. Electronics, shoes,
        skincare, baby products, supplements — all arriving at their doors at a fraction of the
        local retail price.
      </Text>

      <Section style={offerBox}>
        <Text style={offerTitle}>🎁 Welcome Back Offer</Text>
        <Text style={offerBody}>
          <strong>10% off your next shipment.</strong> Applied automatically — no code, no form.
        </Text>
        <Text style={offerDetails}>
          ✅ Valid for 7 days from today<br />
          ✅ Applies to US, UK, and China shipments<br />
          ✅ No minimum weight required
        </Text>
      </Section>

      <Button href="https://buyandshiptonigeria.com/ship-yourself" style={ctaButton}>
        Restart My Shipment →
      </Button>

      <Text style={small}>
        Just say <strong>&quot;I&apos;m back&quot;</strong> on WhatsApp at <strong>08029155825</strong> and we will pick up right where we left off.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const offerBox = { backgroundColor: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '10px', padding: '20px 24px', margin: '16px 0 24px' };
const offerTitle = { fontWeight: 'bold', fontSize: '18px', color: '#1e3a8a', margin: '0 0 8px' };
const offerBody = { fontSize: '15px', color: '#374151', margin: '0 0 12px', lineHeight: '1.5' };
const offerDetails = { fontSize: '14px', color: '#374151', lineHeight: '1.8', margin: 0 };
const ctaButton = { backgroundColor: '#1d4ed8', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '0 0 20px' };
const small = { color: '#6b7280', fontSize: '13px', margin: 0 };

export default WinBackEmail;
