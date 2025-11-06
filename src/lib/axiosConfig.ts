import axios from "axios";

// Configure axios defaults for Wikipedia REST API compliance
// See: https://w.wiki/4wJS and T400119
// User-Agent format: ApplicationName/Version (URL; Contact) [Additional information]
// Note: User-Agent can only be set server-side (browsers block it client-side)
if (typeof window === "undefined") {
  // Server-side only
  axios.defaults.headers.common["User-Agent"] =
    "Entitree/3.0.0 (https://entitree.com; https://github.com/codeledge/entitree) bot";
}

export default axios;

