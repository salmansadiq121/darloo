/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: process.env.NEXT_EXPORT === "true" ? "export" : undefined,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },

  // Disable server-side features for static export
  ...(process.env.NEXT_EXPORT === "true" && {
    // Trailing slash for better compatibility with static hosting
    trailingSlash: true,
  }),
};

export default nextConfig;
