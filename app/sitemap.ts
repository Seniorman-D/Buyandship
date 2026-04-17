import { MetadataRoute } from 'next';

const BASE_URL = 'https://buyandshiptonigeria.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/rates`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/how-it-works`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/ship-yourself`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/procure`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/track`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/faqs`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/policies`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/auth/signup`, priority: 0.6, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/auth/login`, priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  return staticRoutes.map((route) => ({
    url: route.url,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
