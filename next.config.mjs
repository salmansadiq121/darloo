/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["*"],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "cbu01.alicdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.alicdn.com",
        pathname: "/**",
      },
    ],
    // unoptimized: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
