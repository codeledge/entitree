import type { NextApiRequest, NextApiResponse } from "next";

import { AxiosError } from "axios";
import { getGeniCookies } from "helpers/cookies";
import { getGeniProfiles } from "../../services/geniService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const geni = getGeniCookies(req);
  if (!geni)
    return res
      .status(403)
      .json({ message: "No Geni cookies found in request" });

  switch (req.method) {
    case "GET": {
      try {
        const profiles = await getGeniProfiles(
          req.query.guids as string,
          geni.access_token,
        );

        return res.json(profiles);
      } catch (error: any) {
        //console.error(error);
        const axiosError: AxiosError = error;
        return res
          .status(500)
          .json({ message: axiosError.response?.data.error.message });
      }
      break;
    }
    default:
      break;
  }
}
