import axios, { AxiosStatic } from "axios";

// Configure axios defaults for Wikipedia REST API compliance
// See: https://w.wiki/4wJS and T400119
// User-Agent format: ApplicationName/Version (URL; Contact) [Additional information]
// Note: User-Agent can only be set server-side (browsers block it client-side)
export function applyServerAxiosDefaults(instance: AxiosStatic) {
  // don't let a slow upstream hold sockets open indefinitely
  instance.defaults.timeout = 15000;
  instance.defaults.headers.common["User-Agent"] =
    "Entitree/3.0.0 (https://entitree.com; https://github.com/codeledge/entitree) bot";
}

// Server-side only. @entitree/helper's copy of axios is configured in src/instrumentation.ts
if (typeof window === "undefined") applyServerAxiosDefaults(axios);

export default axios;
