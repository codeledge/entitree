import type { NextApiRequest, NextApiResponse } from "next";

import { GENI_ENABLED } from "constants/geni";
import { getGeniCookies } from "helpers/cookies";
import { geniSearch } from "geni-api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!GENI_ENABLED) return res.status(404).json({ message: "Not found" });

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const geni = getGeniCookies(req);
  if (!geni?.access_token)
    return res
      .status(403)
      .json({ message: "No Geni cookies found in request" });

  const term = req.query.term;
  if (typeof term !== "string" || !term)
    return res.status(400).json({ message: "Missing term" });

  try {
    const profiles = await geniSearch(term, geni.access_token);
    return res.json(profiles.slice(0, 15));
  } catch (error: any) {
    // don't echo Geni's raw error body back to the client
    const status = error?.response?.status;
    return res
      .status(status === 401 || status === 403 ? status : 502)
      .json({ message: "Geni request failed" });
  }
}
