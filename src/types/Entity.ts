import { Claim } from "./Claim";
import { LangCode } from "types/Lang";

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
  label?: string;
  description?: string;
  secondLabel?: string;
  birthName?: string;
  birthDate?: string;
  deathDate?: string;
  birthYear?: string;
  deathYear?: string;
  lifeSpanInYears?: string;
  lifeSpan?: string;
  birthPlaceId?: string;
  deathPlaceId?: string;
  startDate?: string;
  endDate?: string;
  startEndSpan?: string;
  inceptionDate?: string;
  abolishedDate?: string;
  inceptionAblishedSpan?: string;
  wikidataUrl?: string;
  wikipediaUrl?: string;
  wikipediaSlug?: string;
  externalLinks?: ExternalLink[];
  website?: string;
  gender?: string;
  isHuman?: boolean;
  isInfantDeath?: boolean;
  simpleClaims?: SimpleClaims;
  thumbnails?: Image[];
  images?: Image[];
  upIds?: string[];
  downIds?: string[];
  rightIds?: string[];
  leftIds?: string[];
  downIdsAlreadySorted?: boolean;
  childrenCount?: number;
  parents?: Entity[];
  children?: Entity[];
  siblings?: Entity[];
  spouses?: Entity[];
  _children?: Entity[];
  _spouses?: Entity[];
  _siblings?: Entity[];
  _parents?: Entity[];
  isParent?: boolean;
  isSibling?: boolean;
  isSpouse?: boolean;
  isChild?: boolean;
  isRoot?: boolean;
  loadingSpouses?: boolean;
  loadingParents?: boolean;
  loadingSiblings?: boolean;
  loadingChildren?: boolean;
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
