import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface VerifyIdentityEmailProps {
  firstName: string;
}

export function VerifyIdentityEmail({ firstName }: VerifyIdentityEmailProps) {
  return (
    <BaseLayout preview="Your warehouse is ready but we cannot ship without this one step.">
      <Heading style={h1}>One step left, {firstName} 🔐</Heading>
      <Text style={body}>
        Your BuyandShip Nigeria account is set up and your warehouse address is ready — but we
        cannot process any shipments until your identity is verified. This is required by Nigerian
        customs regulations and is a one-time step.
      </Text>
      <Text style={body}>
        You can verify with any of the following:
      </Text>

      <Section style={listBox}>
        {[
          '✅ NIN (from your NIN slip or the NIMC app)',
          '✅ International Passport',
          "✅ Driver's Licence",
          "✅ Voter's Card",
        ].map((item) => (
          <Text key={item} style={{ margin: '0 0 8px', fontSize: '14px', color: '#374151' }}>{item}</Text>
        ))}
      </Section>

      <Button href="https://buyandshiptonigeria.com/auth/login" style={ctaButton}>
        Complete Verification →
      </Button>

      <Section style={securityBox}>
        <Text style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
          🔒 <strong>Your information is encrypted and stored securely.</strong>{' '}
          It is used only for customs compliance and is never shared with third parties.
        </Text>
      </Section>

      <Text style={body}>
        Having trouble? WhatsApp us at <strong>08029155825</strong> — we will guide you through it
        in under 3 minutes.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const listBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 16px', margin: '0 0 20px' };
const ctaButton = { backgroundColor: '#0A2540', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '0 0 20px' };
const securityBox = { backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '14px', margin: '16px 0' };

export default VerifyIdentityEmail;
