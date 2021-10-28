import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.headers, req.headers.get("x-forwarded-proto"), req.url);
  if (process.env.NODE_ENV === "production")
    if (req.headers.get("x-forwarded-proto") === "http") {
      const host = req.headers.get("host");
      if (host) return NextResponse.redirect(`https://${host}${req.url}`);
    }
}
