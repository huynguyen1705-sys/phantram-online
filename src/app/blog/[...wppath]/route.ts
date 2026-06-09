import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wppath: string[] }> }
) {
  const { wppath } = await params;
  const path = wppath.join("/");

  // Map WP sitemap XML files to query strings
  // wp-sitemap-posts-post-1.xml → ?sitemap=posts&sitemap-subtype=post&paged=1
  // wp-sitemap-posts-page-1.xml → ?sitemap=posts&paged=1
  // wp-sitemap-taxonomies-category-1.xml → ?sitemap=taxonomies&sitemap-subtype=category&paged=1
  // wp-sitemap-users-1.xml → ?sitemap=users&paged=1
  let wpQuery = "";

  const tripleMatch = path.match(
    /^wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml$/
  );
  const doubleMatch = path.match(/^wp-sitemap-([a-z]+)-(\d+)\.xml$/);
  const xslMatch = path.match(/^wp-sitemap(-index)?\.xsl$/);

  if (tripleMatch) {
    wpQuery = `?sitemap=${tripleMatch[1]}&sitemap-subtype=${tripleMatch[2]}&paged=${tripleMatch[3]}`;
  } else if (doubleMatch) {
    wpQuery = `?sitemap=${doubleMatch[1]}&paged=${doubleMatch[2]}`;
  } else if (xslMatch) {
    // Serve XSL stylesheet directly
    const res = await fetch(
      `${WP_INTERNAL}/${path}${req.nextUrl.search || ""}`,
      { cache: "no-store" }
    );
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": "text/xsl; charset=UTF-8" },
    });
  }

  if (wpQuery) {
    const res = await fetch(`${WP_INTERNAL}/index.php${wpQuery}`, {
      cache: "no-store",
    });
    const xml = await res.text();
    if (xml.includes("<?xml")) {
      return new NextResponse(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  // Default: proxy path to WP
  const search = req.nextUrl.search || "";
  const res = await fetch(`${WP_INTERNAL}/${path}${search}`, {
    cache: "no-store",
  });
  const body = await res.text();
  const ct = res.headers.get("Content-Type") || "text/html";
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": ct },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ wppath: string[] }> }
) {
  const { wppath } = await params;
  const path = wppath.join("/");
  const body = await req.text();
  const search = req.nextUrl.search || "";
  const res = await fetch(`${WP_INTERNAL}/${path}${search}`, {
    method: "POST",
    headers: { "Content-Type": req.headers.get("Content-Type") || "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const resBody = await res.text();
  const ct = res.headers.get("Content-Type") || "text/html";
  return new NextResponse(resBody, {
    status: res.status,
    headers: { "Content-Type": ct },
  });
}
