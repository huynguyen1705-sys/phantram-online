import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Handle WP sitemap index
  if (pathname === "/blog/wp-sitemap.xml") {
    const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`);
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  // Handle sitemap_index.xml (Rank Math or WP fallback)
  if (pathname === "/blog/sitemap_index.xml") {
    const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`);
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  // Handle WP sitemap sub-files: /blog/wp-sitemap-*.xml
  // wp-sitemap-posts-post-1.xml → ?sitemap=posts&sitemap-subtype=post&paged=1
  // wp-sitemap-users-1.xml → ?sitemap=users&paged=1
  const sitemapTriple = pathname.match(
    /^\/blog\/wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml$/
  );
  const sitemapDouble = pathname.match(
    /^\/blog\/wp-sitemap-([a-z]+)-(\d+)\.xml$/
  );
  const sitemapXsl = pathname.match(
    /^\/blog\/(wp-sitemap(-index)?\.xsl)$/
  );

  if (sitemapTriple) {
    const res = await fetch(
      `${WP_INTERNAL}/index.php?sitemap=${sitemapTriple[1]}&sitemap-subtype=${sitemapTriple[2]}&paged=${sitemapTriple[3]}`
    );
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  if (sitemapDouble) {
    const res = await fetch(
      `${WP_INTERNAL}/index.php?sitemap=${sitemapDouble[1]}&paged=${sitemapDouble[2]}`
    );
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  if (sitemapXsl) {
    const res = await fetch(`${WP_INTERNAL}/${sitemapXsl[1]}`);
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
    "/blog/wp-sitemap-:path*.xml",
    "/blog/wp-sitemap:path*.xsl",
  ],
};
