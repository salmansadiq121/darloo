/** @type {import('next').NextConfig} */
const nextConfig = {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
    {
      protocol: "https",
      hostname: "secure.gravatar.com",
    },
    {
      protocol: "https",
      hostname: "flagcdn.com",
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
  reactStrictMode: true,
};

export default nextConfig;
