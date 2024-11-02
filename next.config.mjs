/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },

  productionBrowserSourceMaps: true,

  reactStrictMode: true,
};

export default nextConfig;
