import { GeniProfile, GeniProfileResults } from "types/Geni";

import axios from "axios";
import jsonp from "jsonp-promise";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

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

const geniService = axios.create({
  baseURL: "https://www.geni.com/api",
});

geniService.interceptors.response.use(serviceSuccessInterceptor);

export const searchGeni = async (
  names: string,
  access_token?: string,
): Promise<GeniProfile[]> => {
  const { results } = await geniService.get<any, GeniProfileResults>(
    "/profile/search",
    {
      params: {
        names,
        access_token,
      },
      timeout: 8000,
    },
  );
  return results;
};
