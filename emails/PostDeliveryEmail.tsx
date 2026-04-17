import { Heading, Text, Button, Section, Link } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface PostDeliveryEmailProps {
  firstName: string;
}

export function PostDeliveryEmail({ firstName }: PostDeliveryEmailProps) {
  const waExcellent = 'https://wa.me/2348029155825?text=My%20delivery%20was%20excellent!%20%F0%9F%91%8D';
  const waIssues = 'https://wa.me/2348029155825?text=My%20delivery%20had%20some%20issues.%20I%20would%20like%20to%20discuss.';

  return (
    <BaseLayout preview="Tell us how your delivery went.">
      <Heading style={h1}>How did we do, {firstName}? 🙏</Heading>
      <Text style={body}>
        Your package has been delivered! We hope everything arrived in perfect condition.
        Your feedback helps us improve — it takes just one tap.
      </Text>

      <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
        <Link href={waExcellent} style={ctaGreen}>⭐⭐⭐⭐⭐ Excellent</Link>
        {'    '}
        <Link href={waIssues} style={ctaOutline}>Had some issues</Link>
      </Section>

      <Text style={small}>
        If anything was not perfect, our team will reach out directly to make it right.
        We take every delivery seriously.
      </Text>

      <Section style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '20px' }}>
        <Text style={{ ...body, marginBottom: '12px' }}>Ready for your next shipment?</Text>
        <Button href="https://buyandshiptonigeria.com/ship-yourself" style={ctaBlue}>
          Start Next Shipment →
        </Button>
      </Section>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const ctaGreen = { backgroundColor: '#16a34a', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
const ctaOutline = { border: '2px solid #374151', color: '#374151', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
const ctaBlue = { backgroundColor: '#1d4ed8', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
const small = { color: '#6b7280', fontSize: '13px', margin: 0 };

export default PostDeliveryEmail;
