import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Shipment — BuyandShip Nigeria',
  description: 'Track your BuyandShip Nigeria shipment in real time using your tracking number or Request ID.',
  alternates: { canonical: 'https://buyandshiptonigeria.com/track' },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
