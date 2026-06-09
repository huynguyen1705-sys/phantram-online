import type { NextConfig } from "next";

// WP container accessible via Traefik sslip.io internal URL
// WP is installed at container root (/var/www/html), served publicly at /blog/
// So strip /blog prefix when proxying
const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  async rewrites() {
    return [
      // /blog → WP root
      {
        source: "/blog",
        destination: `${WP_INTERNAL}/`,
      },
      // /blog/ → WP root
      {
        source: "/blog/",
        destination: `${WP_INTERNAL}/`,
      },
      // /blog/anything → WP /anything (strip /blog prefix)
      {
        source: "/blog/:path*",
        destination: `${WP_INTERNAL}/:path*`,
      },
      // WP admin (Traefik already routes via WP login cookie session)
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
    ];
  },
};

export default nextConfig;
