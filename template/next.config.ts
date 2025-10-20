import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['shiki'],

  // Enable standalone output for Docker/Cloud Run deployments
  output: 'standalone',

  // Performance Optimizations
  compress: true, // Enable gzip compression

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'date-fns',
    ],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
