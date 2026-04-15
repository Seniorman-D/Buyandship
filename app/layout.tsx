import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://buyandshiptonigeria.com'),
  title: {
    default: 'BuyandShip Nigeria – Ship from USA, UK & China to Nigeria',
    template: '%s | BuyandShip Nigeria',
  },
  description:
    'Shop from the USA, UK, and China and ship to Nigeria at the cheapest rates. BuyandShip Nigeria offers reliable international shipping, procurement, and delivery services.',
  keywords: [
    'ship from USA to Nigeria',
    'ship from UK to Nigeria',
    'ship from China to Nigeria',
    'buy and ship Nigeria',
    'cheapest international shipping Nigeria',
    'shop America ship Nigeria',
    'buyandship Nigeria',
    'Nigeria shipping agent',
    'international shipping Nigeria',
  ],
  authors: [{ name: 'BuyandShip Nigeria' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://buyandshiptonigeria.com',
    siteName: 'BuyandShip Nigeria',
    title: 'BuyandShip Nigeria – Shop Anywhere. Ship to Nigeria.',
    description:
      'Ship from USA, UK & China to Nigeria at unbeatable rates. Fast, reliable, and trusted.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuyandShip Nigeria – Ship from USA, UK & China',
    description: 'Shop Anywhere. Ship to Nigeria.',
    images: ['/og-image.png'],
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
