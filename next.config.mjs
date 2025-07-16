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
};

export default nextConfig;
