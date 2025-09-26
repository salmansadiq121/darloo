/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "darloo.com",
        port: "",
        pathname: "/**",
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
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "cbu01.alicdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.alicdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "**",
      },
    ],
  },
  // experimental: {
  //   serverComponentsExternalPackages: ["pino", "pino-pretty"],
  // },
  webpack: (config, context) => {
    config.externals.push({
      "thread-stream": "commonjs thread-stream",
    });
    return config;
  },
  staticPageGenerationTimeout: 280,
};

export default nextConfig;

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
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "*.alicdn.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "avatars.githubusercontent.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "s3.eu-north-1.amazonaws.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "secure.gravatar.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "flagcdn.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "cdn.shopify.com",
//         pathname: "**",
//       },
//     ],
//     unoptimized: true,
//   },
//   reactStrictMode: false,
// };

// export default nextConfig;
