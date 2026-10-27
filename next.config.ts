import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The built-in "/:path+/" → "/:path+" redirect runs before middleware, so
  // /products/ would bounce twice. Middleware removes the slash itself, and
  // sends /products/ straight to the shop.
  skipTrailingSlashRedirect: true,
  // Lighthouse 12's mobile UA is a normal Chrome string, so streamed metadata
  // lands in the body and the meta description audit fails. These pages
  // resolve metadata from local data, so every visitor can get it in <head>.
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Inline the small stylesheets so the first paint does not wait on a
    // separate render-blocking CSS request (and so fonts are discovered
    // from the document itself).
    inlineCss: true,
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
