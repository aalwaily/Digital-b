import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        ],
      },
    ];
  },
};

export default nextConfig;
