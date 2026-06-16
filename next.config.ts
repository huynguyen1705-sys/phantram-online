import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  // Note: /blog/* and /wp-* redirects handled by middleware.ts (more reliable than next.config redirects)

  // CRITICAL: prevent Cloudflare/browsers caching HTML so Next.js chunk-hash mismatch
  // after redeploy (browser holds old HTML referencing 404 chunks) cannot crash the app.
  // Static assets under /_next/static still use built-in immutable cache.
  async headers() {
    return [
      {
        // Match all HTML pages (root + any path NOT under /_next/ /api/ /static/ /assets/)
        source: "/:path((?!_next|api|static|assets|favicon|robots\\.txt|sitemap.*|og-image|.*\\.).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=60, must-revalidate" },
        ],
      },
      {
        // Explicit root
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=60, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
