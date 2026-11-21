const isDev = process.env.NODE_ENV !== "production";

// Only scripts are locked down: they're the XSS vector (e.g. JSONP to a host
// taken from Wikidata). Styles/images stay open because styled-components
// injects <style> tags and tree images come from many hosts.
const scriptSrc = [
  "'self'",
  // Next/Turbopack emit a small inline bootstrap script whose content changes
  // every build. Third-party hosts not listed below stay blocked.
  "'unsafe-inline'",
  // Next dev server (react-refresh) needs eval
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://platform.twitter.com",
  "https://*.twimg.com",
  "https://www.paypalobjects.com",
  "https://www.paypal.com",
  "https://www.googletagmanager.com",
  // JSONP: fandom page props and Geni profiles
  "https://*.fandom.com",
  "https://www.geni.com",
].join(" ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `script-src ${scriptSrc}; object-src 'none'; base-uri 'self'`,
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  async headers() {
    // Trees are meant to be embedded, so no X-Frame-Options / frame-ancestors
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
