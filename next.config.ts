import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Tree shaking is handled automatically by Next.js 15
};

export default withBundleAnalyzer(nextConfig);
