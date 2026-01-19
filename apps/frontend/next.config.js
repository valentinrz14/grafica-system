/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist trying to import canvas (not available in browser)
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
