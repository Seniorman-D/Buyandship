import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — BuyandShip Nigeria',
  description: 'Get in touch with BuyandShip Nigeria. WhatsApp us at 08029155825 or email admin@buyandshiptonigeria.com. Mon–Fri, 9am–5pm WAT.',
  alternates: { canonical: 'https://buyandshiptonigeria.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
