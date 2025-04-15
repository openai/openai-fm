import type { NextConfig } from "next";

const IS_DEV = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' ;",
  "connect-src 'self';",
  "style-src 'self' 'unsafe-inline';",
  "img-src 'self'",
  "object-src 'none';",
  "frame-ancestors 'none';",
  IS_DEV ? null : "upgrade-insecure-requests;",
]
  .filter(Boolean)
  .join(" ");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  devIndicators: false,

  // Apply the same SVG transform to the webpack-based production build
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async headers() {
    const headers = [
      {
        key: "Content-Security-Policy",
        value: CSP,
      },
    ];

    if (!IS_DEV) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
