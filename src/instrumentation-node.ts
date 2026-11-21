import { applyServerAxiosDefaults } from "lib/axiosConfig";
import { createRequire } from "node:module";

// @entitree/helper require()s axios' CommonJS build, while our own code gets
// the ESM build: two instances with separate defaults. Configure the exact
// copy the helper loads, or Wikimedia rejects its requests (no User-Agent).
const rootRequire = createRequire(`${process.cwd()}/`);
const helperRequire = createRequire(rootRequire.resolve("@entitree/helper"));
const helperAxios = helperRequire("axios");
applyServerAxiosDefaults(helperAxios.default ?? helperAxios);
