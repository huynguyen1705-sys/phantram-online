import type { NextConfig } from "next";

// WP container accessible via Traefik sslip.io internal URL
// WP is installed at container root (/var/www/html), served publicly at /blog/
// Strip /blog prefix when proxying to WP
const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  async rewrites() {
    return {
      // beforeFiles: check BEFORE checking filesystem/route handlers
      // These match BEFORE app router route handlers - skip sitemap files
      beforeFiles: [],
      // afterFiles: check AFTER checking filesystem/route handlers
      // Route handlers (app/blog/wp-sitemap.xml/route.ts) will run first for sitemap URLs
      afterFiles: [
        // /blog → WP root
        {
          source: "/blog",
          destination: `${WP_INTERNAL}/`,
        },
        {
          source: "/blog/",
          destination: `${WP_INTERNAL}/`,
        },
        // /blog/anything → WP /anything (strip /blog prefix)
        // afterFiles means route handlers run first, so sitemap XML routes are handled by handlers
        {
          source: "/blog/:path*",
          destination: `${WP_INTERNAL}/:path*`,
        },
        // WP admin
        {
          source: "/wp-admin/:path*",
          destination: `${WP_INTERNAL}/wp-admin/:path*`,
        },
        {
          source: "/wp-login.php",
          destination: `${WP_INTERNAL}/wp-login.php`,
        },
        {
          source: "/wp-json/:path*",
          destination: `${WP_INTERNAL}/wp-json/:path*`,
        },
        {
          source: "/wp-content/:path*",
          destination: `${WP_INTERNAL}/wp-content/:path*`,
        },
        {
          source: "/wp-includes/:path*",
          destination: `${WP_INTERNAL}/wp-includes/:path*`,
        },
      ],
      // fallback: check after both filesystem and afterFiles rewrites
      fallback: [],
    };
  },
};

export default nextConfig;
