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
      config.resolve.alias['pdfjs-dist/build/pdf.worker.entry'] = false;

      // Add fallbacks for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        http: false,
        https: false,
        url: false,
      };
    }

    // Mark canvas as external for both server and client
    const externals = config.externals || [];
    config.externals = Array.isArray(externals)
      ? [...externals, 'canvas']
      : [externals, 'canvas'];

    return config;
  },
};

module.exports = nextConfig;
