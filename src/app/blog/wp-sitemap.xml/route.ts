import { NextResponse } from "next/server";

const WP_INTERNAL =
  "http://wordpress-jfe8vq5y0pjsttbd20t6yn5m.45.128.210.165.sslip.io";

export async function GET() {
  const res = await fetch(`${WP_INTERNAL}/index.php?sitemap=index`, {
    cache: "no-store",
  });
  const xml = await res.text();
  return new NextResponse(xml, {
    status: res.status,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
