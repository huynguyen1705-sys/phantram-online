import { NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function GET() {
  // Rank Math sitemap index - proxy to WP
  const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=1`, {
    cache: "no-store",
  });
  const xml = await res.text();
  // If Rank Math not active, fallback to WP core sitemap
  if (!xml.includes("<?xml") || xml.includes("<!DOCTYPE")) {
    const res2 = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`, {
      cache: "no-store",
    });
    const xml2 = await res2.text();
    return new NextResponse(xml2, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
