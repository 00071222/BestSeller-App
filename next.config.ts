import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "images.unsplash.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "placehold.co",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "utfs.io",
  //     },
  //   ],
  // },
};

export default nextConfig;
