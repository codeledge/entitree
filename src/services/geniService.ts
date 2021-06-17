import jsonp from "jsonp-promise";

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
  // birth: {
  // date: {
  // day: 22,
  // month: 4,
  // year: 1918,
  // formatted_date: "April 22, 1918"
  // },
  // location: {
  // city: "New York",
  // state: "New York",
  // country: "United States",
  // country_code: "US",
  // latitude: 40.71449,
  // longitude: -74.00713,
  // formatted_location: "New York, New York, United States"
  // }
  // },
  // death: {
  // date: {
  // day: 31,
  // month: 7,
  // year: 1996,
  // formatted_date: "July 31, 1996"
  // },
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
};

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
