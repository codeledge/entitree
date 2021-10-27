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
  occupation?: string;
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
  location: GeniLocation;
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

export type GeniProfileResults = {
  results: GeniProfile[];
};

export type GeniImmediateFamilyResults = {
  results: GeniImmediateFamily[];
};

export type GeniImmediateFamily = {
  focus: GeniProfile;
  nodes: Record<string, GeniNode>;
};

export type GeniRelType = "child" | "partner";

export type GeniEdge = {
  rel: GeniRelType;
};

export type GeniNode = GeniProfile & {
  edges: Record<string, GeniEdge>;
};

export type GeniUnion = {
  id: string;
  url: string;
  guid: string;
  status: "spouse";
  edges: Record<string, GeniEdge>;
};
