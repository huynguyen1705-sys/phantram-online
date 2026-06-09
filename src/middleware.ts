import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug: log all requests coming through
  const isXml = pathname.endsWith(".xml");
  const isTest = pathname === "/blog/middleware-test";
  const isSitemap = pathname.includes("sitemap") || pathname.includes("wp-sitemap");

  if (isTest) {
    return new NextResponse("OK:middleware_running", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (isXml && isSitemap) {
    // Determine WP query
    let wpQuery = "sitemap=index";
    const triple = pathname.match(/wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml/);
    const double = pathname.match(/wp-sitemap-([a-z]+)-(\d+)\.xml/);
    if (triple) {
      wpQuery = `sitemap=${triple[1]}&sitemap-subtype=${triple[2]}&paged=${triple[3]}`;
    } else if (double) {
      wpQuery = `sitemap=${double[1]}&paged=${double[2]}`;
    }
    
    try {
      const res = await fetch(`${WP_INTERNAL}/index.php?${wpQuery}`, {
        cache: "no-store",
      });
      const xml = await res.text();
      return new NextResponse(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "X-Powered-By": "wp-proxy",
        },
      });
    } catch (e) {
      return new NextResponse(`fetch error: ${e}`, { status: 500, headers: { "Content-Type": "text/plain" } });
    }
  }

  return NextResponse.next();
}

// Only match sitemap XML paths
export const config = {
  matcher: ["/blog/:path*.xml", "/blog/middleware-test"],
};
