import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://buyandshiptonigeria.com'),
  title: {
    default: 'BuyandShip Nigeria — Ship from US, UK & China to Nigeria | $9/lb',
    template: '%s | BuyandShip Nigeria',
  },
  description:
    'Shop from Amazon, ASOS, Walmart & more. We ship from the US, UK and China to Nigeria at $9/lb. No hidden fees, NIN-verified, 7–14 day delivery. Free account.',
  keywords: [
    'ship from US to Nigeria',
    'ship from UK to Nigeria',
    'buy and ship Nigeria',
    'international shipping Nigeria',
    'cheap shipping Nigeria',
    'no customs duty Nigeria',
    'Amazon to Nigeria shipping',
    'procurement service Nigeria',
    'shipping forwarding Nigeria',
    'shop abroad ship to Nigeria',
    'ship from China to Nigeria',
    'Nigeria shipping agent',
  ],
  authors: [{ name: 'BuyandShip Nigeria' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://buyandshiptonigeria.com',
    siteName: 'BuyandShip Nigeria',
    title: 'Ship from US, UK & China to Nigeria — BuyandShip',
    description:
      'Cheapest rates. No hidden fees. Shop anywhere, delivered to your door in Nigeria.',
    images: [{ url: 'https://buyandshiptonigeria.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ship from US, UK & China to Nigeria — BuyandShip',
    description: 'Cheapest rates. No hidden fees. Shop anywhere, delivered to your door in Nigeria.',
    images: ['https://buyandshiptonigeria.com/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://buyandshiptonigeria.com' },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
