import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler: resolve('./node_modules/next/dist/server/lib/incremental-cache/file-system-cache.js'),

  experimental: {
    taint: true,
  },

  reactCompiler: true,

  redirects: async () => [
    {
      source: '/city/:org',
      destination: '/org/:org',
      permanent: true,
    },
    {
      source: '/city/:org/calendar/:ids',
      destination: '/org/:org/calendar/:ids',
      permanent: true,
    },
  ],

  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};

export default nextConfig;
