/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['localhost:3000'] } },
  images: { remotePatterns: [
    { protocol: 'https', hostname: '**.theraflow.app' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ]},
  // Headers for security
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' }
    ]}];
  },
};
module.exports = nextConfig;
