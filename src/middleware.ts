import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

async function fetchXML(wpUrl: string): Promise<NextResponse> {
  const res = await fetch(wpUrl, { cache: "no-store" });
  const xml = await res.text();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // WP sitemap index
  if (
    pathname === "/blog/wp-sitemap.xml" ||
    pathname === "/blog/sitemap_index.xml"
  ) {
    return fetchXML(`${WP_INTERNAL}/index.php?sitemap=index`);
  }

  // wp-sitemap-{type}-{subtype}-{page}.xml
  const triple = pathname.match(
    /^\/blog\/wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml$/
  );
  if (triple) {
    return fetchXML(
      `${WP_INTERNAL}/index.php?sitemap=${triple[1]}&sitemap-subtype=${triple[2]}&paged=${triple[3]}`
    );
  }

  // wp-sitemap-{type}-{page}.xml
  const double = pathname.match(/^\/blog\/wp-sitemap-([a-z]+)-(\d+)\.xml$/);
  if (double) {
    return fetchXML(
      `${WP_INTERNAL}/index.php?sitemap=${double[1]}&paged=${double[2]}`
    );
  }

  // XSL stylesheets
  if (pathname.match(/^\/blog\/wp-sitemap.*\.xsl$/)) {
    const file = pathname.replace("/blog/", "");
    const res = await fetch(`${WP_INTERNAL}/${file}`, { cache: "no-store" });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": "text/xsl; charset=UTF-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog/wp-sitemap.xml",
    "/blog/sitemap_index.xml",
    "/blog/wp-sitemap-:path+.xml",
    "/blog/wp-sitemap:path+.xsl",
  ],
};
