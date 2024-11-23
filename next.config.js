// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "labplhompumzwpzizkgl.supabase.co",
      },
      {
        protocol: 'https',
        hostname: 'thumbnail.image.rakuten.co.jp',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['dig-book.vercel.app'],
  },
};

module.exports = nextConfig;
