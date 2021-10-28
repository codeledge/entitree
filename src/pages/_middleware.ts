import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("URL", req.url as unknown as NextURL);
  if (process.env.NODE_ENV === "production")
    if (req.headers.get("x-forwarded-proto") === "http") {
      const host = req.headers.get("host");
      if (host) return NextResponse.redirect(`https://${host}${req.url}`);
    }
}
