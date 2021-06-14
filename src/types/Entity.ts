import { Claim } from "./Claim";
import { Country } from "constants/countries";
import { LangCode } from "types/Lang";
import { Religion } from "constants/religions";

export interface Sitelink {
  site: string;
  title: string;
  badges: string[];
  url?: string;
}

export interface LanguageEntry {
  language: string;
  value: string;
}

export interface WikiEntity {
  type: string;
  datatype?: string;
  id: string;
  pageid?: number;
  ns?: number;
  title?: string;
  lastrevid?: number;
  modified?: string;
  redirects?: {
    from: string;
    to: string;
  };
  aliases?: Record<string, LanguageEntry[]>;
  claims?: Record<string, Claim[]>;
  descriptions?: Record<string, LanguageEntry>;
  labels?: Record<string, LanguageEntry>;
  sitelinks?: Record<string, Sitelink>;
}

export interface Entity extends WikiEntity {
  _children?: Entity[];
  _parents?: Entity[];
  _siblings?: Entity[];
  _spouses?: Entity[];
  abolishedDate?: string;
  birthDate?: string;
  birthName?: string;
  birthPlaceId?: string;
  birthYear?: string;
  children?: Entity[];
  childrenCount?: number;
  countryOfCitizenship?: Country;
  deathDate?: string;
  deathPlaceId?: string;
  deathYear?: string;
  description?: string;
  downIds?: string[];
  downIdsAlreadySorted?: boolean;
  endDate?: string;
  externalLinks?: ExternalLink[];
  gender?: string;
  images?: Image[];
  inceptionAblishedSpan?: string;
  inceptionDate?: string;
  isChild?: boolean;
  isHuman?: boolean;
  isInfantDeath?: boolean;
  isParent?: boolean;
  isRoot?: boolean;
  isSibling?: boolean;
  isSpouse?: boolean;
  label?: string;
  leftIds?: string[];
  lifeSpan?: string;
  lifeSpanInYears?: string;
  loadingChildren?: boolean;
  loadingParents?: boolean;
  loadingSiblings?: boolean;
  loadingSpouses?: boolean;
  parents?: Entity[];
  religion?: Religion;
  rightIds?: string[];
  secondLabel?: string;
  siblings?: Entity[];
  simpleClaims?: SimpleClaims;
  spouses?: Entity[];
  startDate?: string;
  startEndSpan?: string;
  thumbnails?: Image[];
  upIds?: string[];
  website?: string;
  wikidataUrl?: string;
  wikipediaSlug?: string;
  wikipediaUrl?: string;
}

export type Image = {
  url: string;
  alt: string;
};

export type EntityProp = {
  id: string;
  slug: string;
  label: string;
  overrideLabel?: string;
  overrideLabels?: Record<LangCode, string>; // actually only CHILD_ID has
  isFav?: boolean;
};

export type SimpleClaims = Record<string, SimpleClaim[]>;

export type SimpleClaim = {
  value: string;
  qualifiers: Record<PropId, string[]>;
};

export type ExternalLink = {
  title: string;
  iconSrc: string;
  alt: string;
  url: string;
};

export type PropId = string;
