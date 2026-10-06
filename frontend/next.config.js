/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://cultos-backend.onrender.com",
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cultos-backend.onrender.com/api/:path*',
      },
      {
        source: '/health',
        destination: 'https://cultos-backend.onrender.com/health',
      },
    ];
  },
};

module.exports = nextConfig;
