import { Heading, Text, Section, Hr } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface VerificationSubmissionEmailProps {
  fullName: string;
  email: string;
  phone: string;
  fileName: string;
}

export function VerificationSubmissionEmail({ fullName, email, phone, fileName }: VerificationSubmissionEmailProps) {
  return (
    <BaseLayout preview={`New self-procurement verification submission from ${fullName}`}>
      <Heading style={h1}>New Verification Submission</Heading>
      <Text style={body}>
        Someone submitted an ID for verification via the self-procurement portal on the
        website. Their document is attached to this email.
      </Text>

      <Section style={infoBox}>
        <Text style={infoRow}><strong>Name:</strong> {fullName}</Text>
        <Text style={infoRow}><strong>Email:</strong> {email}</Text>
        <Text style={infoRow}><strong>Phone:</strong> {phone || 'Not provided'}</Text>
        <Text style={infoRow}><strong>Attachment:</strong> {fileName}</Text>
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
