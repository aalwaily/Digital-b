import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const polyfill = path.join(process.cwd(), "node_modules/next/dist/build/polyfills/polyfill-module.js");
      config.resolve.alias[polyfill] = path.join(process.cwd(), "lib/empty-module.js");
    }
    return config;
  },
  // next/og reads this TTF with readFileSync(process.cwd()). NFT does not
  // follow that call, so the file has to be traced onto every server route.
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
