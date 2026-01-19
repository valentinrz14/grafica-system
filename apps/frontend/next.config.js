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
      // Ensure resolve.alias exists
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias.canvas = false;

      // Add fallbacks for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };

      // Externalize canvas module
      if (!config.externals) {
        config.externals = [];
      }
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas');
      }
    }
    return config;
  },
};

module.exports = nextConfig;
