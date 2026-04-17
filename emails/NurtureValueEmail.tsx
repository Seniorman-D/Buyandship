import { Heading, Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './layouts/BaseLayout';

interface NurtureValueEmailProps {
  firstName: string;
}

export function NurtureValueEmail({ firstName }: NurtureValueEmailProps) {
  return (
    <BaseLayout preview="The same money buys 3x more when you shop from source.">
      <Heading style={h1}>The price gap will shock you, {firstName}</Heading>
      <Text style={body}>
        Here is a real example of what you could be saving every single time you shop abroad:
      </Text>

      <Section style={compareBox}>
        <Text style={compareTitle}>👟 Nike Air Max 270</Text>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <tbody>
            <tr>
              <td style={tdLabel}>Computer Village, Lagos</td>
              <td style={tdBad}>₦95,000–₦130,000</td>
            </tr>
            <tr>
              <td style={tdLabel}>Amazon.com (via BuyandShip)</td>
              <td style={tdGood}>~$75 (~₦55,000) + ~$9 shipping</td>
            </tr>
            <tr style={{ borderTop: '1px solid #e5e7eb' }}>
              <td style={{ ...tdLabel, fontWeight: 'bold', paddingTop: '8px' }}>You save</td>
              <td style={{ ...tdGood, fontWeight: 'bold', fontSize: '16px', paddingTop: '8px' }}>₦30,000–₦70,000</td>
            </tr>
          </tbody>
        </table>
        <Text style={{ margin: '10px 0 0', fontSize: '12px', color: '#6b7280' }}>* Exchange rate may vary. Comparison based on typical Lagos retail prices.</Text>
      </Section>

      <Text style={body}>
        The same principle applies to electronics, skincare, supplements, kitchen equipment, baby
        products, books, and fashion. Shopping from source almost always beats local retail prices —
        even after shipping costs.
      </Text>
      <Text style={body}>
        No dollar card? <strong>No problem.</strong> Our Procurement Service lets you send us
        any product link and we buy it for you for just 5% of the item cost.
      </Text>

      <Button href="https://buyandshiptonigeria.com/ship-yourself" style={ctaButton}>
        Start My First Shipment →
      </Button>
    </BaseLayout>
  );
}

const h1 = { color: '#0A2540', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' };
const body = { color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 14px' };
const compareBox = { backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '20px', margin: '0 0 20px' };
const compareTitle = { fontWeight: 'bold', fontSize: '16px', color: '#0A2540', margin: '0 0 12px' };
const tdLabel = { fontSize: '14px', color: '#374151', padding: '4px 0' };
const tdBad = { fontSize: '14px', color: '#dc2626', fontWeight: 'bold', padding: '4px 0', textAlign: 'right' as const };
const tdGood = { fontSize: '14px', color: '#16a34a', fontWeight: 'bold', padding: '4px 0', textAlign: 'right' as const };
const ctaButton = { backgroundColor: '#1d4ed8', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };

export default NurtureValueEmail;
