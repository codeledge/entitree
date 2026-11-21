import { GeniProfile } from "geni-api";
import jsonp from "jsonp-promise";

export default async function getGeniProfile(
  geniId: string,
): Promise<GeniProfile | undefined> {
  // Geni profile ids are numeric; anything else could change the JSONP path
  if (!/^\d+$/.test(geniId)) return;
  try {
    const data = await jsonp(`https://www.geni.com/api/profile-g${geniId}`, {
      param: "callback",
      timeout: 1000,
    }).promise;
    return data;
  } catch (e) {
    //TODO: go through server and use axios
  }
}
