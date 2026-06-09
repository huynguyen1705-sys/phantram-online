import { NextRequest, NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

async function fetchWP(url: string): Promise<NextResponse> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Host: "phantram.online",
      "X-Forwarded-Host": "phantram.online",
      "X-Forwarded-Proto": "https",
    },
    redirect: "manual", // don't follow redirects
  });
  
  // If redirect, follow manually but keep original host
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location") || "";
    // Extract path from redirect and re-fetch with query string
    const match = location.match(/\/([^?]*)\??(.*)$/);
    if (match) {
      const newUrl = `${WP_INTERNAL}/${match[1]}${match[2] ? "?" + match[2] : ""}`;
      return fetchWP(newUrl);
    }
  }
  
  const body = await res.text();
  const ct = res.headers.get("Content-Type") || "text/html";
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": ct },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/blog/wp-sitemap.xml" || pathname === "/blog/sitemap_index.xml") {
    const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`, {
      cache: "no-store",
      headers: {
        Host: "phantram.online",
        "X-Forwarded-Host": "phantram.online",
        "X-Forwarded-Proto": "https",
      },
      redirect: "follow",
    });
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  const triple = pathname.match(/^\/blog\/wp-sitemap-([a-z]+)-([a-z_-]+)-(\d+)\.xml$/);
  const double = pathname.match(/^\/blog\/wp-sitemap-([a-z]+)-(\d+)\.xml$/);

  if (triple) {
    const wpUrl = `${WP_INTERNAL}/index.php?sitemap=${triple[1]}&sitemap-subtype=${triple[2]}&paged=${triple[3]}`;
    const res = await fetch(wpUrl, {
      cache: "no-store",
      headers: { Host: "phantram.online", "X-Forwarded-Host": "phantram.online" },
    });
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  if (double) {
    const wpUrl = `${WP_INTERNAL}/index.php?sitemap=${double[1]}&paged=${double[2]}`;
    const res = await fetch(wpUrl, {
      cache: "no-store",
      headers: { Host: "phantram.online", "X-Forwarded-Host": "phantram.online" },
    });
    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=UTF-8" },
    });
  }

  if (pathname.match(/^\/blog\/wp-sitemap.*\.xsl$/)) {
    const file = pathname.replace("/blog/", "");
    const res = await fetch(`${WP_INTERNAL}/${file}`, {
      cache: "no-store",
      headers: { Host: "phantram.online" },
    });
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
