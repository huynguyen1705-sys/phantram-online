import { NextRequest, NextResponse } from "next/server";

const BLOG_DOMAIN = "https://blog.phantram.online";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog",
    "/blog/:path*",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
  ],
};
