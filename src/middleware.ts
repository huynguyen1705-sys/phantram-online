import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname === "/blog/test-middleware") {
    return new NextResponse("MIDDLEWARE_WORKS", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/test-middleware"],
};
