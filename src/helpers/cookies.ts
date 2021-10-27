import cookie from "cookie";

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export function getGeniCookies(req) {
  try {
    const { geni } = parseCookies(req);
    return JSON.parse(geni);
  } catch (err) {
    return null;
  }
}
