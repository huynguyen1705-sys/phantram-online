import type { NextConfig } from "next";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  async rewrites() {
    return [
      { source: "/blog", destination: `${WP_INTERNAL}/` },
      { source: "/blog/", destination: `${WP_INTERNAL}/` },
      { source: "/blog/:path*", destination: `${WP_INTERNAL}/:path*` },
      { source: "/wp-admin/:path*", destination: `${WP_INTERNAL}/wp-admin/:path*` },
      { source: "/wp-login.php", destination: `${WP_INTERNAL}/wp-login.php` },
      { source: "/wp-json/:path*", destination: `${WP_INTERNAL}/wp-json/:path*` },
      { source: "/wp-content/:path*", destination: `${WP_INTERNAL}/wp-content/:path*` },
      { source: "/wp-includes/:path*", destination: `${WP_INTERNAL}/wp-includes/:path*` },
    ];
  },
};

export default nextConfig;
