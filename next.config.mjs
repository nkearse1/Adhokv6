/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/admin/dashboard',
        destination: '/admin/panel',
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: '@empty/canvas',
      'pdfjs-dist/canvas': '@empty/canvas',
    };
    return config;
  },
};

export default nextConfig;
