import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: [
    "10.201.10.57",
    "10.201.10.57:3000",
    "10.251.195.57",
    "10.251.195.57:3000",
    "10.194.190.57",
    "10.194.190.57:3000",
    "10.0.2.2",
    "localhost",
    "localhost:3000",
  ],
};

export default nextConfig;
