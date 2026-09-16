import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  const firstName = name.split(' ')[0];
  return (
    <BaseLayout preview="Reset your BuyandShip Nigeria password">
      <Heading style={h1}>Reset your password</Heading>
      <Text style={body}>Hi {firstName},</Text>
      <Text style={body}>
        We received a request to reset your BuyandShip Nigeria password. Click the button below to
        choose a new one. This link expires in 1 hour.
      </Text>
      <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
        <Button href={resetUrl} style={button}>Reset Password</Button>
      </Section>
      <Text style={muted}>
        If you didn&apos;t request this, you can safely ignore this email — your password will stay
        the same.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '22px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' };
const muted = { color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '16px 0 0' };
const button = {
  backgroundColor: '#F97316', color: '#ffffff', padding: '14px 28px', borderRadius: '6px',
  fontSize: '16px', fontWeight: 'bold', textDecoration: 'none',
};

export default PasswordResetEmail;
