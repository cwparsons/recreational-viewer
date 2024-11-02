import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler: resolve('./node_modules/next/dist/server/lib/incremental-cache/file-system-cache.js'),

  experimental: {
    taint: true,
  },

  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};

export default nextConfig;
