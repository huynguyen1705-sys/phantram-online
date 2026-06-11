import type { NextConfig } from "next";

const BLOG_DOMAIN = "https://blog.phantram.online";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/blog", destination: `${BLOG_DOMAIN}/`, permanent: true },
      { source: "/blog/", destination: `${BLOG_DOMAIN}/`, permanent: true },
      { source: "/blog/:path*", destination: `${BLOG_DOMAIN}/:path*`, permanent: true },
      { source: "/wp-admin/:path*", destination: `${BLOG_DOMAIN}/wp-admin/:path*`, permanent: true },
      { source: "/wp-login.php", destination: `${BLOG_DOMAIN}/wp-login.php`, permanent: true },
      { source: "/wp-json/:path*", destination: `${BLOG_DOMAIN}/wp-json/:path*`, permanent: true },
      { source: "/wp-content/:path*", destination: `${BLOG_DOMAIN}/wp-content/:path*`, permanent: true },
      { source: "/wp-includes/:path*", destination: `${BLOG_DOMAIN}/wp-includes/:path*`, permanent: true },
    ];
  },
};

export default nextConfig;
