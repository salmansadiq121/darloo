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
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },

  webpack(config, { isServer }) {
    // Handle SVG with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.externals.push({
      "thread-stream": "commonjs thread-stream",
    });

    return config;
  },

  images: {
    unoptimized: true, // allows all external images without optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all https hosts
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // allow all http hosts too (if needed)
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
    ],
  },

  staticPageGenerationTimeout: 280,
};

export default nextConfig;
