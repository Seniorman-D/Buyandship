import { Html, Head, Preview, Body, Container, Section, Img, Text, Link } from '@react-email/components';

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function BaseLayout({ preview, children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '580px', margin: '0 auto', padding: '24px 0' }}>
          <Section style={{ backgroundColor: '#0A2540', borderRadius: '12px 12px 0 0', padding: '24px 32px' }}>
            <Img src="https://buyandshiptonigeria.com/logo-white.png" alt="BuyandShip Nigeria" width="160" />
          </Section>
          <Section style={{ backgroundColor: '#ffffff', padding: '36px 32px' }}>
            {children}
          </Section>
          <Section style={{ backgroundColor: '#f1f5f9', borderRadius: '0 0 12px 12px', padding: '24px 32px', textAlign: 'center' as const }}>
            <Text style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>
              BuyandShip Nigeria &middot;{' '}
              <Link href="https://buyandshiptonigeria.com" style={{ color: '#1D78D4' }}>buyandshiptonigeria.com</Link>
            </Text>
            <Text style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>
              admin@buyandshiptonigeria.com &middot; WhatsApp: 08029155825
            </Text>
            <Text style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Mon–Fri, 9am–5pm WAT &middot; Lagos, Nigeria
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
