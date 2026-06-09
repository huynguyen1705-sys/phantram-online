import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Test endpoint
  if (pathname === "/blog/middleware-test") {
    return new NextResponse("OK:middleware_running", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // WP sitemap index
  if (
    pathname === "/blog/wp-sitemap.xml" ||
    pathname === "/blog/sitemap_index.xml"
  ) {
    try {
      const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`, {
        cache: "no-store",
      });
      const xml = await res.text();
      return new NextResponse(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (e) {
      return new NextResponse(`Error: ${e}`, { status: 500 });
    }
  }

  // wp-sitemap-{type}-{subtype}-{page}.xml
  const triple = pathname.match(
    /^\/blog\/wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml$/
  );
  if (triple) {
    const res = await fetch(
      `${WP_INTERNAL}/index.php?sitemap=${triple[1]}&sitemap-subtype=${triple[2]}&paged=${triple[3]}`,
      { cache: "no-store" }
    );
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  // wp-sitemap-{type}-{page}.xml
  const double = pathname.match(/^\/blog\/wp-sitemap-([a-z]+)-(\d+)\.xml$/);
  if (double) {
    const res = await fetch(
      `${WP_INTERNAL}/index.php?sitemap=${double[1]}&paged=${double[2]}`,
      { cache: "no-store" }
    );
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog/middleware-test",
    "/blog/wp-sitemap.xml",
    "/blog/sitemap_index.xml",
    "/blog/wp-sitemap-:path+.xml",
  ],
};
