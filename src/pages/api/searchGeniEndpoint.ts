import type { NextApiRequest, NextApiResponse } from "next";

import { AxiosError } from "axios";
import { getGeniCookies } from "helpers/cookies";
import { geniSearch } from "geni-api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const geni = getGeniCookies(req);
  switch (req.method) {
    case "GET": {
      try {
        const profiles = await geniSearch(
          req.query.term as string,
          geni.access_token,
        );

        return res.json(profiles.slice(0, 15));
      } catch (error: any) {
        const axiosError: AxiosError = error;
        return res.status(500).json({ message: axiosError.response?.data });
      }
    }
    default:
      break;
  }
}
