import {
  Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to BuyandShip Nigeria – Your warehouse addresses are ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to BuyandShip Nigeria, {name}!</Heading>
          <Text style={text}>
            Thank you for joining BuyandShip Nigeria. You can now shop from the USA, UK, and China
            and ship directly to Nigeria at the best rates.
          </Text>
          <Text style={text}>
            Below are your personal warehouse addresses. Use your full name on every shipment.
          </Text>

          <Section style={addressBox}>
            <Text style={addressTitle}>🇺🇸 USA Warehouse</Text>
            <Text style={addressText}>
              BUYANDSHIP – {name.toUpperCase()}<br />
              145 Hook Creek Blvd, Bldg B6A<br />
              Valley Stream, NY 11581<br />
              Airport Industrial Office Park<br />
              GrandBelle International<br />
              Tel: +1 516-256-5666 | Fax: +1 516-256-0606
            </Text>
          </Section>

          <Section style={addressBox}>
            <Text style={addressTitle}>🇬🇧 UK Warehouse</Text>
            <Text style={addressText}>
              BUYANDSHIP – {name.toUpperCase()}<br />
              EURO-AFRICAN EXPRESS SERVICES LTD.<br />
              UNIT 13A HEATHWAY IND&apos;L ESTATE<br />
              MANCHESTER WAY, WANTZ RD.<br />
              DAGENHAM, RM10 8PN<br />
              Tel: +44 208 534 4604 | +44 7956 149 169
            </Text>
          </Section>

          <Section style={addressBox}>
            <Text style={addressTitle}>🇨🇳 China Warehouse</Text>
            <Text style={addressText}>
              BUYANDSHIP – {name.toUpperCase()}<br />
              +2348029155825<br />
              广东广州市越秀区矿泉街瑶台村沙涌南北站南路17号<br />
              伍福智创1楼126<br />
              Contact: 13500032394 | +2348029155825
            </Text>
            <Text style={{ color: '#dc2626', fontSize: '13px' }}>
              ⚠️ IMPORTANT: +2348029155825 MUST appear on your China shipping label as the shipping mark.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={text}>
            <strong>Getting Started:</strong>
          </Text>
          <Text style={text}>
            1. Shop at any US, UK, or China store<br />
            2. Use your warehouse address above as the delivery address<br />
            3. Submit a shipping request on our website once you&apos;ve placed your order<br />
            4. We&apos;ll notify you when your items arrive and ship them to Nigeria
          </Text>
          <Text style={text}>
            Need help? WhatsApp us at{' '}
            <Link href="https://wa.me/2348029155825">08029155825</Link>
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} BuyandShip Nigeria. Shop Anywhere. Ship to Nigeria.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, Arial, sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', maxWidth: '600px' };
const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold' };
const text = { color: '#374151', fontSize: '15px', lineHeight: '1.6' };
const addressBox = { backgroundColor: '#f0f4f8', borderLeft: '4px solid #F97316', padding: '16px', marginBottom: '16px', borderRadius: '4px' };
const addressTitle = { color: '#0A2540', fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px' };
const addressText = { color: '#374151', fontSize: '14px', lineHeight: '1.8', margin: 0 };
const hr = { borderColor: '#e5e7eb', margin: '20px 0' };
const footer = { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const };

export default WelcomeEmail;
