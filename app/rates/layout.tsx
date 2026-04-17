import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Rates & Calculator — BuyandShip Nigeria',
  description: 'Calculate your shipping cost from the US ($9/lb), UK (£9/kg), or China ($10/kg) to Nigeria. Transparent rates, no hidden fees. Try our rate calculator.',
  alternates: { canonical: 'https://buyandshiptonigeria.com/rates' },
};

export default function RatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
