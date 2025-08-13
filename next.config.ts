import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kuavmwiqmlrfbddxoxjr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Otimização para reduzir avisos de cache
    if (!isServer) {
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 1,
      };
    }
    return config;
  },
};

export default nextConfig;
