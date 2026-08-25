import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
 async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nestfind-production-312f.up.railway.app/api/:path*",
      },
    ];
},

};

export default nextConfig;

