/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // helpful during migration
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
