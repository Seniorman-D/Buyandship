import { Heading, Text, Button, Section, Link } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface HowToGuideEmailProps {
  firstName: string;
}

export function HowToGuideEmail({ firstName }: HowToGuideEmailProps) {
  const steps = [
    {
      n: '1',
      title: 'Create & verify your account',
      body: 'Complete NIN or ID verification in your dashboard. Takes under 2 minutes and is required for Nigerian customs.',
    },
    {
      n: '2',
      title: 'Copy your warehouse address',
      body: 'Go to Dashboard → My Addresses. Copy your US, UK, or China address and paste it at checkout on any store.',
    },
    {
      n: '3',
      title: 'Shop on any store',
      body: 'Amazon, eBay, Walmart, ASOS, Shein, AliExpress — shop normally. Ship to your warehouse address.',
    },
    {
      n: '4',
      title: 'We ship to Nigeria',
      body: 'We weigh your package, send you a WhatsApp notification with the cost, you confirm and pay, we ship. Track at /track.',
    },
  ];

  return (
    <BaseLayout preview="4 simple steps. Read this once and you will never be confused again.">
      <Heading style={h1}>4 steps from Amazon to your door 🚪</Heading>
      <Text style={body}>
        {firstName}, a lot of people sign up and then freeze. We have got you. Here is exactly how it works.
      </Text>

      {steps.map((s) => (
        <Section key={s.n} style={stepCard}>
          <Text style={stepNum}>{s.n}</Text>
          <Section>
            <Text style={stepTitle}>{s.title}</Text>
            <Text style={stepBody}>{s.body}</Text>
          </Section>
        </Section>
      ))}

      <Section style={rateBox}>
        <Text style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 'bold', color: '#1e40af' }}>📦 Current Rates</Text>
        <Text style={{ margin: 0, fontSize: '13px', color: '#1e3a8a' }}>
          🇺🇸 USA: $9/lb (min $35) &nbsp;·&nbsp; 🇬🇧 UK: £9/kg (min £45) &nbsp;·&nbsp; 🇨🇳 China: $10/kg (min $30)
        </Text>
        <Text style={{ margin: '8px 0 0', fontSize: '12px' }}>
          <Link href="https://buyandshiptonigeria.com/rates" style={{ color: '#1d4ed8' }}>Try the rate calculator →</Link>
        </Text>
      </Section>

      <Text style={{ ...body, marginTop: '16px' }}>
        Can&apos;t shop on foreign sites? No dollar card?{' '}
        <Link href="https://buyandshiptonigeria.com/procure" style={{ color: '#0A2540', fontWeight: 'bold' }}>Use our Procurement Service</Link> — we buy it for you for just 5% of the item cost.
      </Text>

      <Button href="https://buyandshiptonigeria.com/procure" style={ctaGreen}>
        Use Procurement Service →
      </Button>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' };
const stepCard = { display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '14px', marginBottom: '10px' };
const stepNum = { backgroundColor: '#0A2540', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0, margin: 0 };
const stepTitle = { color: '#0A2540', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' };
const stepBody = { color: '#374151', fontSize: '13px', lineHeight: '1.5', margin: 0 };
const rateBox = { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px', margin: '16px 0' };
const ctaGreen = { backgroundColor: '#16a34a', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '8px' };

export default HowToGuideEmail;
