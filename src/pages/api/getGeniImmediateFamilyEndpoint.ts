import type { NextApiRequest, NextApiResponse } from "next";

import { GENI_ENABLED } from "constants/geni";
import { getGeniCookies } from "helpers/cookies";
import { geniImmediateFamily } from "geni-api";

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

  const guids = req.query.guids;
  if (typeof guids !== "string" || !guids)
    return res.status(400).json({ message: "Missing guids" });

  try {
    const profiles = await geniImmediateFamily(guids, geni.access_token);
    return res.json(profiles);
  } catch (error: any) {
    // don't echo Geni's raw error body back to the client
    const status = error?.response?.status;
    return res
      .status(status === 401 || status === 403 ? status : 502)
      .json({ message: "Geni request failed" });
  }
}
