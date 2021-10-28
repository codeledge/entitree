import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "production")
    if (req.headers["x-forwarded-proto"] !== "https") {
      const host = req.headers.get("host");
      console.log(req.headers);
      console.log({ host });

      if (host) return NextResponse.redirect(`https://${host}${req.url}`);
    }
}
