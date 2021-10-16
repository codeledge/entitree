import { EntityProp } from "types/Entity";
import { SecondLabel } from "types/Lang";

export const INSTANCE_OF_ID = "P31";

export const BIRTH_DATE_ID = "P569";
export const BIRTH_NAME_ID = "P1477";
export const BIRTH_PLACE_ID = "P19";
export const CHILD_ID = "P40";
export const COUNTRY_OF_CITIZENSHIP = "P27";
export const DEATH_DATE_ID = "P570";
export const DEATH_PLACE_ID = "P20";
export const DISSOLVED_ABOLISHED_DEMOLISHED_ID = "P576";
export const END_DATE_ID = "P582";
export const EYE_COLOR_ID = "P1340";
export const FANDOM_ARTICLE_ID = "P6262";
export const FATHER_ID = "P22";
export const GENDER_ID = "P21";
export const GENI_ID = "P2600";
export const HAIR_COLOR_ID = "P1884";
export const IMAGE_ID = "P18";
export const INCEPTION_ID = "P571";
export const INSTAGRAM_ID = "P2003";
export const LANGUAGE_OF_WORK_ID = "P407";
export const LOCATED_IN_ID = "P131";
export const LOGO_ID = "P154";
export const MOTHER_ID = "P25";
export const NAME_IN_KANA_ID = "P1814";
export const NICKNAME_ID = "P1449";
export const NUMBER_OF_CHILDREN_ID = "P1971";
export const OCCUPATION_ID = "P106";
export const PARTNER_ID = "P451"; // unmarried partner
export const RELIGION_ID = "P140";
export const SIBLINGS_ID = "P3373";
export const SOURCING_CIRCUMSTANCES_ID = "P1480";
export const SPOUSE_ID = "P26";
export const START_DATE_ID = "P580";
export const STUDENT_ID = "P802";
export const STUDENT_OF_ID = "P1066";
export const TWITTER_ID = "P2002";
export const WEBSITE_ID = "P856";
export const WIKITREE_ID = "P2949";

export const FAMILY_IDS_MAP = {
  [CHILD_ID]: true,
  [SIBLINGS_ID]: true,
  [SPOUSE_ID]: true,
  [FATHER_ID]: true,
  [MOTHER_ID]: true,
};

export const FAMILY_TREE_PROP: EntityProp = {
  id: CHILD_ID,
  slug: "family_tree",
  label: "child",
  overrideLabel: "family tree",
  isFav: true,
};

export const SOCIAL_PROPS_IDS = {
  P6634: {
    title: "Open LinkedIn profile in a new tab",
    iconName: "linkedin",
    alt: "linkedin icon",
    baseUrl: "https://www.linkedin.com/in/",
  },
  P2003: {
    title: "Open instagram profile in a new tab",
    alt: "instagram icon",
    iconName: "instagram",
    baseUrl: "https://www.instagram.com/",
  },
  P2002: {
    title: "Open twitter profile in a new tab",
    alt: "twitter icon",
    iconName: "twitter",
    baseUrl: "https://twitter.com/",
  },
  P2013: {
    title: "Open facebook page in a new tab",
    iconName: "facebook",
    alt: "facebook icon",
    baseUrl: "https://www.facebook.com/",
  },
  P2949: {
    title: "Open wikitree profile in a new tab",
    iconName: "wikitree",
    alt: "wikitree icon",
    baseUrl: "https://www.wikitree.com/wiki/",
  },
  P2600: {
    title: "Open geni profile in a new tab",
    iconName: "geni",
    alt: "geni icon",
    baseUrl: "https://www.geni.com/profile/index/",
  },
  P7085: {
    title: "Open tiktok user in a new tab",
    iconName: "tiktok",
    alt: "tiktok icon",
    baseUrl: "https://www.tiktok.com/@",
  },
  // 'P345' : ['imdb',' https://www.imdb.com/name/$1/']
};

export const RIGHT_ENTITY_OPTIONS = [
  {
    propIds: [],
    title: "Nothing",
  },
  {
    propIds: [SPOUSE_ID],
    title: "Only spouses",
  },
  {
    propIds: [SPOUSE_ID, PARTNER_ID],
    title: "Spouses and partners",
  },
  {
    propIds: [PARTNER_ID],
    title: "Only partners",
  },
];

export const DEFAULT_PROPERTY_ALL = "all";

export const EXTRA_INFO_OPTIONS = [
  {
    code: "eyeColor",
    title: "Eye Color",
  },
  {
    code: "hairColor",
    title: "Hair Color",
  },
  {
    code: "countryFlag",
    title: "Country Flag",
  },
  {
    code: "religion",
    title: "Religion",
  },
  {
    code: "occupation",
    title: "Occupations",
  },
];

export const SECOND_LABELS: SecondLabel[] = [
  {
    code: NICKNAME_ID,
    name: "Nickname",
  },
  {
    code: BIRTH_NAME_ID,
    name: "Birth name",
  },
  {
    code: NAME_IN_KANA_ID,
    name: "Name in Kana",
  },
];
