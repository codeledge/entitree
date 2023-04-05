import { GeniProfile } from "geni-api";
import jsonp from "jsonp-promise";

export default async function getGeniProfile(
  geniId: string,
): Promise<GeniProfile | undefined> {
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
