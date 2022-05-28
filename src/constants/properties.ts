import {
  FormatUrlProps,
  WD_BIRTH_NAME,
  WD_FACEBOOK_ID,
  WD_FANVUE_CREATOR_ID,
  WD_FATHER,
  WD_GENI_COM_PROFILE_ID,
  WD_INSTAGRAM_USERNAME,
  WD_LINKEDIN_PERSONAL_PROFILE_ID,
  WD_MOTHER,
  WD_NAME_IN_KANA,
  WD_NICKNAME,
  WD_SIBLING,
  WD_SPOUSE,
  WD_TIKTOK_USERNAME,
  WD_TWITTER_USERNAME,
  WD_UNMARRIED_PARTNER,
  WD_WIKITREE_PERSON_ID,
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

type SocialProps = {
  id: FormatUrlProps;
  title: string;
  iconName: string;
};

export const SOCIAL_PROPS_IDS: SocialProps[] = [
  {
    id: WD_LINKEDIN_PERSONAL_PROFILE_ID,
    title: "Open LinkedIn profile in a new tab",
    iconName: "linkedin",
  },
  {
    id: WD_INSTAGRAM_USERNAME,
    title: "Open instagram profile in a new tab",
    iconName: "instagram",
  },
  {
    id: WD_TWITTER_USERNAME,
    title: "Open twitter profile in a new tab",
    iconName: "twitter",
  },
  {
    id: WD_FACEBOOK_ID,
    title: "Open facebook page in a new tab",
    iconName: "facebook",
  },
  {
    id: WD_WIKITREE_PERSON_ID,
    title: "Open wikitree profile in a new tab",
    iconName: "wikitree",
  },
  {
    id: WD_GENI_COM_PROFILE_ID,
    title: "Open geni profile in a new tab",
    iconName: "geni",
  },
  {
    id: WD_TIKTOK_USERNAME,
    title: "Open tiktok user in a new tab",
    iconName: "tiktok",
  },
  {
    id: WD_FANVUE_CREATOR_ID,
    title: "Open Fanvue profile in a new tab",
    iconName: "fanvue",
  },
  // 'P345' : ['imdb',' https://www.imdb.com/name/$1/']
];

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
    propIds: [WD_UNMARRIED_PARTNER],
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
