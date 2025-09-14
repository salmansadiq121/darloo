// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["*"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//       {
//         protocol: "https",
//         hostname: "cbu01.alicdn.com",
//       },
//     ],
//     unoptimized: true,
//   },
//   reactStrictMode: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
