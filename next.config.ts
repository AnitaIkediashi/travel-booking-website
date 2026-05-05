import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  experimental: {
    globalNotFound: true,
    // serverActions: {
    //   allowedOrigins: [
    //     'ft5pdpzn-3000.uks1.devtunnels.ms',
    //     'localhost:3000'
    //   ],
    // },
  },
};

export default nextConfig;
