import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "production")
    if (req.headers.get("x-forwarded-proto") === "http") {
      const host = req.headers.get("host");
      if (host)
        return NextResponse.redirect(`https://${host}${req.nextUrl.pathname}`);
    }
}
