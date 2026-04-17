import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BuyandShip Nigeria',
    short_name: 'BuyandShip',
    description: 'Ship from US, UK & China to Nigeria. $9/lb, no hidden fees, delivered to your door.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A2540',
    theme_color: '#0A2540',
    icons: [
      { src: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
