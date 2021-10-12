import type { NextApiRequest, NextApiResponse } from "next";

import { setSetting } from "store/settingsSlice";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  if (!req.query.access_token || !req.query.expires_in) {
    return res.json({ err: "Please set access_token and expires_in" });
  }
  // setSetting({
  //   geni: {
  //     access_token: req.query.access_token.toString(),
  //     // expires_in: parseInt(req.query.expires_in.toString()),
  //   },
  // });
  console.log("Redirect back");
  res.redirect("/geni");
}
