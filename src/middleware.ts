import { NextRequest, NextResponse } from "next/server";

const BLOG_BASE = "https://1phantram.com/blog";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // /blog/* is served by Cloudflare Worker before Next.js. If a request reaches
  // the app directly (preview/origin), let it fall through instead of redirecting
  // back to the old subdomain.
  if (pathname === "/blog" || pathname === "/blog/" || pathname.startsWith("/blog/")) {
    return NextResponse.next();
  }

  // WordPress assets/admin shortcuts on root domain should live under /blog/*.
  if (
    pathname.startsWith("/wp-admin") ||
    pathname.startsWith("/wp-login.php") ||
    pathname.startsWith("/wp-json/") ||
    pathname.startsWith("/wp-content/") ||
    pathname.startsWith("/wp-includes/")
  ) {
    return NextResponse.redirect(`${BLOG_BASE}${pathname}${search || ""}`, 301);
  }

  // Embed routes: allow cross-origin iframe + cache
  if (pathname.startsWith("/embed/")) {
    const res = NextResponse.next();
    res.headers.set("Content-Security-Policy", "frame-ancestors *;");
    res.headers.set("X-Frame-Options", "ALLOWALL");
    res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return res;
  }

  // Forward URL info to OG image routes via headers
  if (pathname.endsWith("/opengraph-image")) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("x-search", search || "");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog",
    "/blog/:path*",
    "/embed/:path*",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/:path*/opengraph-image",
  ],
};
