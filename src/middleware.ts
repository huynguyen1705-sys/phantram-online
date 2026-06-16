import { NextRequest, NextResponse } from "next/server";

const BLOG_DOMAIN = "https://blog.phantram.online";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Redirect /blog/* → blog.phantram.online/*
  if (pathname === "/blog" || pathname === "/blog/") {
    return NextResponse.redirect(`${BLOG_DOMAIN}/`, 301);
  }
  if (pathname.startsWith("/blog/")) {
    const newPath = pathname.replace(/^\/blog/, "");
    return NextResponse.redirect(`${BLOG_DOMAIN}${newPath}`, 301);
  }

  // Redirect /wp-* paths to blog subdomain
  if (
    pathname.startsWith("/wp-admin") ||
    pathname.startsWith("/wp-login.php") ||
    pathname.startsWith("/wp-json/") ||
    pathname.startsWith("/wp-content/") ||
    pathname.startsWith("/wp-includes/")
  ) {
    return NextResponse.redirect(`${BLOG_DOMAIN}${pathname}`, 301);
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
  // (opengraph-image.tsx file convention doesn't receive searchParams natively)
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
