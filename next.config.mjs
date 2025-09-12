/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**.alicdn.com", // supports cbu01.alicdn.com and others
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com", // example AWS
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com", // wildcard AWS bucket domains
      },
      {
        protocol: "https",
        hostname: "*.alibaba.com", // if you also need alibaba images
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
