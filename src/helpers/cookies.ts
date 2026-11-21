import { parseCookie } from "cookie";

export function parseCookies(req) {
  return parseCookie(req ? req.headers.cookie || "" : document.cookie);
}

export function getGeniCookies(req) {
  try {
    const { geni } = parseCookies(req);
    if (!geni) return null;
    return JSON.parse(geni);
  } catch (err) {
    return null;
  }
}
