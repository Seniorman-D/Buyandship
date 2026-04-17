import { Heading, Text, Button, Section, Hr, Link } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const firstName = name.split(' ')[0];
  return (
    <BaseLayout preview={`Welcome ${firstName} — your warehouse address is ready. Shop from Amazon, ASOS & more.`}>
      <Heading style={h1}>Welcome to BuyandShip, {firstName} 🇳🇬</Heading>
      <Text style={body}>
        You now have personal warehouse addresses in the USA, UK, and China. Shop on any store,
        ship to your address, and we deliver to your door in Nigeria.
      </Text>

      {/* US Address */}
      <Section style={addrCard}>
        <Text style={addrTitle}>🇺🇸 USA Warehouse</Text>
        <Text style={addrText}>
          BUYANDSHIP — {name.toUpperCase()}<br />
          145 Hook Creek Blvd, Bldg B6A<br />
          Valley Stream, NY 11581, USA<br />
          Tel: +1 516-256-5666
        </Text>
      </Section>

      {/* UK Address */}
      <Section style={addrCard}>
        <Text style={addrTitle}>🇬🇧 UK Warehouse</Text>
        <Text style={addrText}>
          BUYANDSHIP — {name.toUpperCase()}<br />
          EURO-AFRICAN EXPRESS SERVICES LTD.<br />
          Unit 13A Heathway Industrial Estate<br />
          Dagenham, RM10 8PN, UK<br />
          Tel: +44 208 534 4604
        </Text>
      </Section>

      {/* China Address */}
      <Section style={addrCard}>
        <Text style={addrTitle}>🇨🇳 China Warehouse</Text>
        <Text style={addrText}>
          BUYANDSHIP — {name.toUpperCase()}<br />
          +2348029155825<br />
          广东广州市越秀区矿泉街瑶台村沙涌南北站南路17号<br />
          伍福智创1楼126<br />
          Contact: 13500032394
        </Text>
        <Section style={warningBox}>
          <Text style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
            ⚠️ <strong>Your phone number +2348029155825 MUST appear on every China shipping label.</strong>{' '}
            Packages without this number may be undeliverable.
          </Text>
        </Section>
      </Section>

      <Button href="https://buyandshiptonigeria.com/rates" style={ctaButton}>
        See Shipping Rates →
      </Button>

      <Hr style={hr} />

      <Section style={tipBox}>
        <Text style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
          💡 <strong>Pro tip:</strong> Add your warehouse address as a saved address in your Amazon or eBay account
          right now so it is ready at every checkout.
        </Text>
      </Section>

      <Text style={body}>
        Questions? <Link href="https://wa.me/2348029155825" style={{ color: '#16a34a' }}>WhatsApp us at 08029155825</Link> — Mon–Fri, 9am–5pm WAT.
      </Text>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' };
const addrCard = { backgroundColor: '#eff6ff', borderLeft: '4px solid #0A2540', padding: '16px', marginBottom: '12px', borderRadius: '4px' };
const addrTitle = { color: '#0A2540', fontWeight: 'bold', fontSize: '15px', margin: '0 0 6px' };
const addrText = { color: '#374151', fontSize: '13px', lineHeight: '1.8', margin: 0 };
const warningBox = { backgroundColor: '#fef3c7', borderRadius: '6px', padding: '10px', marginTop: '10px' };
const ctaButton = { backgroundColor: '#0A2540', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '16px 0' };
const hr = { borderColor: '#e5e7eb', margin: '24px 0' };
const tipBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px' };

export default WelcomeEmail;
