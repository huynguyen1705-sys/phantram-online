import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  // Note: /blog/* and /wp-* redirects handled by middleware.ts (more reliable than next.config redirects)
};

export default nextConfig;
