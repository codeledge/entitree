import fs from "fs";
import getConfig from "next/config";
import path from "path";
import urljoin from "url-join";

export const getFullUrl = (request, url) => {
  return urljoin(request.protocol + "://" + request.get("host"), url);
};

export const staticFileExists = (staticFilePath) => {
  return fs.existsSync(
    path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, staticFilePath),
  );
};
