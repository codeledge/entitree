import { Claim } from "./Claim";
import { Country } from "constants/countries";
import { LangCode } from "types/Lang";
import { PropColor } from "constants/eyeHairColors";
import { SparqlEmoji } from "types/SparqlEmoji";

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

export interface WikibaseEntity {
  type?: string;
  missing?: string;
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

export interface Entity extends WikibaseEntity {
  abolishedDate?: string;
  birthDate?: string;
  birthISO?: string;
  birthName?: string;
  birthPlaceId?: string;
  birthYear?: string;
  childrenCount?: number;
  closedChildTreeIds?: string[];
  closedParentTreeIds?: string[];
  closedSiblingTreeIds?: string[];
  closedSpouseTreeIds?: string[];
  countryOfCitizenship?: Country;
  deathDate?: string;
  deathPlaceId?: string;
  deathYear?: string;
  description?: string;
  downIds?: string[];
  downIdsAlreadySorted?: boolean;
  endDate?: string;
  externalLinks?: ExternalLink[];
  eyeColor?: PropColor;
  factgridUrl?: string;
  fandomHost?: string;
  fandomId?: string;
  fandomUrl?: string;
  gender?: string;
  geniId?: string;
  hairColor?: PropColor;
  inceptionAblishedSpan?: string;
  inceptionDate?: string;
  isHuman?: boolean;
  isInfantDeath?: boolean;
  label?: string;
  leftIds?: string[];
  lifeSpan?: string;
  lifeSpanInYears?: string;
  loadingChildren?: boolean;
  loadingParents?: boolean;
  loadingSiblings?: boolean;
  loadingSpouses?: boolean;
  nameInKana?: string;
  nickName?: string;
  occupations?: SparqlEmoji[];
  openChildTreeIds?: string[];
  openParentTreeIds?: string[];
  openSiblingTreeIds?: string[];
  openSpouseTreeIds?: string[];
  partnersIds?: string[];
  peoplepillImageUrl?: string;
  peoplepillSlug?: string;
  religion?: SparqlEmoji;
  rightIds?: string[];
  simpleClaims?: SimpleClaims; //TODO not available on client
  spousesIds?: string[];
  startDate?: string;
  startEndSpan?: string;
  thumbnails?: Image[];
  treeId?: string;
  upIds?: string[];
  website?: string;
  wikidataUrl?: string;
  wikipediaSlug?: string;
  wikipediaUrl?: string;
}

export type Image = {
  url: string;
  alt?: string;
  sourceUrl?: string;
  imageDb?: boolean;
  urlByType?: string[];
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
