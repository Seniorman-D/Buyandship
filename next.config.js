/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Netlify — do not use 'export' output
  output: undefined,

  // Image optimisation via Netlify's built-in image CDN
  images: {
    loader: 'default',
    domains: [
      'wgujfhlearxunccaldrj.supabase.co', // Supabase Storage
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Trailing slash consistency for Netlify routing
  trailingSlash: false,

  // Compress responses
  compress: true,

  // Headers already handled in netlify.toml
  // but add here as fallback for local dev
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  experimental: {
    // Required for Netlify Edge Functions compatibility
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

module.exports = nextConfig;
