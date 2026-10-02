import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/hakkimizda", permanent: true },
      { source: "/activity", destination: "/faaliyetler", permanent: true },
      { source: "/activity/:slug", destination: "/faaliyetler/:slug", permanent: true },
      { source: "/contact", destination: "/iletisim", permanent: true },
      { source: "/cookie", destination: "/cookies", permanent: true },
      { source: "/cookie-policy", destination: "/cookies", permanent: true },
      { source: "/information-society-services", destination: "/iss", permanent: true },
    ];
  },

  turbopack: {
    rules: {
      "*.mp4": {
        type: "asset",
      },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.mp4$/i,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
