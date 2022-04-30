export default function isInIframe() {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
