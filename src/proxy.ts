import { NextRequest, NextResponse } from "next/server";

// Hosts we're willing to redirect to; anything else (e.g. a forged Host header
// on a request sent straight to the origin IP) falls back to the canonical one
const CANONICAL_HOST = "www.entitree.com";
const ALLOWED_HOSTS = new Set(["entitree.com", "www.entitree.com"]);

export function proxy(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return;
  if (req.headers.get("x-forwarded-proto") !== "http") return;

  const host = req.headers.get("host")?.toLowerCase() ?? "";
  const target = ALLOWED_HOSTS.has(host) ? host : CANONICAL_HOST;

  return NextResponse.redirect(
    `https://${target}${req.nextUrl.pathname}${req.nextUrl.search}`,
    308,
  );
}
