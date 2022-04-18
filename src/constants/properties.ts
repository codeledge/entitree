import {
  WD_BIRTH_NAME,
  WD_FATHER,
  WD_MOTHER,
  WD_NAME_IN_KANA,
  WD_NICKNAME,
  WD_SIBLING,
  WD_SPOUSE,
  WD_UNMARRIED_PARTNER,
} from "@entitree/helper";

import { EntityProp } from "types/Entity";
import { SecondLabel } from "types/Lang";

export const WD_CHILD = "P40";
export const FAMILY_IDS_MAP = {
  [WD_CHILD]: true,
  [WD_SIBLING]: true,
  [WD_SPOUSE]: true,
  [WD_FATHER]: true,
  [WD_MOTHER]: true,
};

export const FAMILY_TREE_PROP: EntityProp = {
  id: WD_CHILD,
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
    propIds: [WD_SPOUSE],
    title: "Only spouses",
  },
  {
    propIds: [WD_SPOUSE, WD_UNMARRIED_PARTNER],
    title: "Spouses and partners",
  },
  {
    propIds: [WD_SPOUSE],
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
    code: WD_NICKNAME,
    name: "Nickname",
  },
  {
    code: WD_BIRTH_NAME,
    name: "Birth name",
  },
  {
    code: WD_NAME_IN_KANA,
    name: "Name in Kana",
  },
];
