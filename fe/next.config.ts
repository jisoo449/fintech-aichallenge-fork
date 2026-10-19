import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:8080';

    if (backendUrl.startsWith('http://') || backendUrl.startsWith('https://')) {
      const cleanBackend = backendUrl
        .replace(/\/+$/, '')
        .replace(/\/api(\/v1)?$/, '');

      return [
        {
          source: '/api/:path*',
          destination: `${cleanBackend}/api/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
