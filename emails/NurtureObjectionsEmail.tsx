import { Heading, Text, Button, Section, Link } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface NurtureObjectionsEmailProps {
  firstName: string;
}

export function NurtureObjectionsEmail({ firstName }: NurtureObjectionsEmailProps) {
  const reassurances = [
    'NIN verification speeds up customs clearance — verified accounts are flagged as trusted.',
    'Transparent rates — $9/lb US, £9/kg UK, $10/kg China — calculated before you shop. Use our rate calculator.',
    'No hidden fees. The rate you see is the rate you pay. Period.',
    '7–14 business days with a real tracking number you can monitor at /track.',
    'Real human WhatsApp support — not a bot. Real answers in minutes, not days.',
  ];

  return (
    <BaseLayout preview={`"What if my package gets seized at customs?" — Let's address that.`}>
      <Heading style={h1}>Let us talk about the fear, {firstName}</Heading>
      <Text style={body}>
        We hear it all the time: <em>"What if my package gets held at customs? What if there are
        hidden charges? What if it never arrives?"</em>
      </Text>
      <Text style={body}>
        These fears are valid — bad experiences with other forwarders are real. But here is why
        BuyandShip Nigeria is different:
      </Text>

      <Section style={listBox}>
        {reassurances.map((r, i) => (
          <Text key={i} style={{ margin: '0 0 10px', fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
            ✅ <strong>{r.split(' — ')[0]}</strong>{r.includes(' — ') ? ` — ${r.split(' — ')[1]}` : ''}
          </Text>
        ))}
      </Section>

      <Text style={body}>
        Still not sure? Read through our FAQs — we have answered every common question honestly.
      </Text>

      <Section style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        <Link href="https://buyandshiptonigeria.com/faqs" style={ctaOutline}>
          Read Our FAQs
        </Link>
        {'   '}
        <Link href="https://buyandshiptonigeria.com/ship-yourself" style={ctaFilled}>
          Ship My First Package →
        </Link>
      </Section>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const listBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px 20px', margin: '0 0 20px' };
const ctaOutline = { border: '2px solid #0A2540', color: '#0A2540', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
const ctaFilled = { backgroundColor: '#0A2540', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };

export default NurtureObjectionsEmail;
