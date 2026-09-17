import { Heading, Text, Section, Hr } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface VerificationSubmissionEmailProps {
  fullName: string;
  email: string;
  phone: string;
  nin: string;
  verifiedName: string;
}

export function VerificationSubmissionEmail({ fullName, email, phone, nin, verifiedName }: VerificationSubmissionEmailProps) {
  return (
    <BaseLayout preview={`${fullName} just verified their NIN via the self-procurement portal`}>
      <Heading style={h1}>New NIN Verification — Prembly Confirmed ✅</Heading>
      <Text style={body}>
        Someone verified their identity via the self-procurement portal on the website. Their
        NIN was confirmed live against Prembly&apos;s database.
      </Text>

      <Section style={infoBox}>
        <Text style={infoRow}><strong>Name Submitted:</strong> {fullName}</Text>
        <Text style={infoRow}><strong>Name on NIN Record:</strong> {verifiedName || 'Not returned'}</Text>
        <Text style={infoRow}><strong>Email:</strong> {email}</Text>
        <Text style={infoRow}><strong>Phone:</strong> {phone || 'Not provided'}</Text>
        <Text style={infoRow}><strong>NIN:</strong> {nin}</Text>
      </Section>

      <Hr style={hr} />
      <Text style={small}>
        Reply to this email to reach the customer directly, or follow up with them on WhatsApp.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '22px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' };
const infoBox = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 20px' };
const infoRow = { color: '#374151', fontSize: '14px', margin: '0 0 6px' };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const small = { color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: 0 };

export default VerificationSubmissionEmail;
