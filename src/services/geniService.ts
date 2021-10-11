import { GeniEntity } from "types/Entity";
import axios from "axios";
import jsonp from "jsonp-promise";

type GeniLocation = {
  city: string;
  state: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  formatted_location: string;
};
type GeniEvent = {
  date: {
    day: number;
    month: number;
    year: number;
    formatted_date: string;
    circa: boolean;
  };
  location: GeniLocation;
};
export type GeniRelType = "child" | "partner";
type GeniEdge = {
  [key: string]: {
    rel: GeniRelType;
  };
};

export type GeniProfile = {
  id: string;
  url: string;
  profile_url: string;
  public: boolean;
  guid: string;
  first_name: string;
  middle_name: string;
  maiden_name: string;
  last_name: string;
  name: string;
  is_alive: boolean;
  gender: string;
  // current_residence: {
  // city: "Houston",
  // state: "Texas",
  // country: "United States",
  // country_code: "US",
  // latitude: 29.76047,
  // longitude: -95.36982,
  // formatted_location: "Houston, Texas, United States"
  // },
  // created_by: "https://www.geni.com/api/profile-101",
  // big_tree: true,
  // claimed: false,
  mugshot_urls: {
    large?: string;
    medium: string;
    small: string;
    thumb: string;
    print: string;
    thumb2: string;
    url: string;
  };
  // unions: [
  // "https://www.geni.com/api/union-322",
  // "https://www.geni.com/api/union-200"
  // ],
  // marriage_orders: {
  // 4025682641820010303: 1
  // },
  // birth_order: 2,
  // living: false,
  // creator: "https://www.geni.com/api/user-1",
  birth: GeniEvent;
  death: GeniEvent;
  // death: {
  // date: {
  // day: 31,
  // month: 7,
  // year: 1996,
  // formatted_date: "July 31, 1996"
  // },
  location: GeniLocation;
  // location: {
  // city: "Houston",
  // state: "Texas",
  // latitude: 29.76047,
  // longitude: -95.36982,
  // formatted_location: "Houston, Texas"
  // }
  // },
  // photo_urls: {
  // medium: "https://photos.geni.com/p10/1092/4345/53444837f974770e/yip94wig_medium.jpg",
  // small: "https://photos.geni.com/p10/1092/4345/53444837f974770e/yip94wig_small.jpg",
  // thumb: "https://photos.geni.com/p10/1092/4345/53444837f974770e/yip94wig_t.jpg",
  // print: "https://photos.geni.com/p10/1092/4345/53444837f974770e/yip94wig_print.jpg",
  // thumb2: "https://photos.geni.com/p10/1092/4345/53444837f974770e/yip94wig_t2.jpg",
  // url: "https://www.geni.com/api/photo_crop-6000000008809903886"
  // },
  // created_at: "1166895284",
  // updated_at: "1573975321",
  // deleted: false
  //add custom fields
  birthYear: string;
  deahtYear: string;
};
type GeniNodes = {
  [key: string]: GeniProfile & {
    edges: GeniEdge[];
  };
};

export type GeniResults = {
  results: GeniImmediateFamily[];
};

export type GeniImmediateFamily = {
  focus?: GeniProfile;
  nodes: GeniNodes[];
};
export async function getGeniProfile(
  geniId: string,
): Promise<GeniProfile | undefined> {
  // try {
  console.log(`https://www.geni.com/api/profile-g${geniId}`);
  const data = await jsonp(`https://www.geni.com/api/profile-g${geniId}`, {
    param: "callback",
    timeout: 2000,
  }).promise;
  return data;
  // } catch (e) {
  //   //TODO: go through server and use axios
  // }
}

export async function getGeniProfileAxios(
  geniId: string,
): Promise<GeniProfile | undefined> {
  // try {
  const { data } = await axios.get(
    `https://www.geni.com/api/profile-${geniId}?access_token=G6vd9cVFuYvBdNkNJgLeKpZy9GXgmtfeyXCden3c`,
  );
  return data;
  // } catch (e) {
  //   //TODO: go through server and use axios
  // }
}
const access_token = "T7NzscraNxFfvUuoumH40S4SPmiuGAE0um9UCeTX";
function createGeniUrl(ids) {
  return `https://www.geni.com/api/profile/immediate-family?ids=${ids}&fields=id,maiden_name,name,first_name,last_name,birth,death,gender,mugshot_urls&access_token=${access_token}`;
}
export async function getGeniProfileFamily(
  geniIds: string[],
): Promise<GeniResults> {
  // try {
  const ids = geniIds.join(",");
  const data = await jsonp(createGeniUrl(ids), {
    param: "callback",
    timeout: 2000,
  }).promise;
  if (!data.results) {
    return { results: [data] };
  }
  return data;
  // } catch (e) {
  //   //TODO: go through server and use axios
  // }
}

export async function getGeniProfileFamilyAxios(
  geniIds: string[],
): Promise<GeniResults> {
  const ids = geniIds.join(",");
  // try {
  const { data } = await axios.get(createGeniUrl(ids));
  if (!data.results) {
    return { results: [data] };
  }
  return data;
  // } catch (e) {
  //   //TODO: go through server and use axios
  // }
}

export const geniSearch = async (term, languageCode) => {
  const geniService = axios.create({
    baseURL: "https://www.geni.com",
  });
  // geniService.interceptors.response.use(serviceSuccessInterceptor);
  // const { data } = await geniService.get<any>("/api/profile/search", {
  //   p,
  // });
  const params = {
    access_token,
    names: term,
  };
  const data = await jsonp(
    "https://www.geni.com/api/profile/search?" + new URLSearchParams(params),
    {
      param: "callback",
      timeout: 2000,
    },
  ).promise;
  if (data.results) {
    return data.results;
  }
  return [data];
};
