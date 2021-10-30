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
  areTargetIdsSorted?: boolean;
  birthDate?: string;
  birthISO?: string;
  birthName?: string;
  birthPlace?: string;
  birthPlaceId?: string;
  birthYear?: string;
  closedChildTreeIds?: string[];
  closedParentTreeIds?: string[];
  closedSiblingTreeIds?: string[];
  closedSpouseTreeIds?: string[];
  countryOfCitizenship?: Country;
  deathDate?: string;
  deathPlace?: string;
  deathPlaceId?: string;
  deathYear?: string;
  description?: string;
  endDate?: string;
  externalLinks?: ExternalLink[];
  eyeColor?: PropColor;
  factgridUrl?: string;
  fandomHost?: string;
  fandomId?: string;
  fandomUrl?: string;
  gender?: string;
  geniId?: string;
  geniProfileId?: string;
  geniProfileUrl?: string;
  hairColor?: PropColor;
  inceptionAblishedSpan?: string;
  inceptionDate?: string;
  isHuman?: boolean;
  isInfantDeath?: boolean;
  label?: string;
  lifeSpan?: string;
  lifeSpanInYears?: string;
  loadingChildren?: boolean;
  loadingParents?: boolean;
  loadingSiblings?: boolean;
  loadingSpouses?: boolean;
  nameInKana?: string;
  nextAfterIds?: string[];
  nextBeforeIds?: string[];
  nickName?: string;
  occupations?: SparqlEmoji[];
  openChildTreeIds?: string[];
  openParentTreeIds?: string[];
  openSiblingTreeIds?: string[];
  openSpouseTreeIds?: string[];
  partnersIds?: string[]; // a subset of nextAfterIds
  peoplepillImageUrl?: string;
  peoplepillSlug?: string;
  religion?: SparqlEmoji;
  simpleClaims?: SimpleClaims; //TODO not available on client
  sourceIds?: string[];
  spousesIds?: string[]; // a subset of nextAfterIds
  startDate?: string;
  startEndSpan?: string;
  targetIds?: string[];
  targetsCount?: number;
  thumbnails?: Image[];
  treeId?: string;
  website?: string;
  wikidataId?: string;
  wikidataUrl?: string;
  wikipediaSlug?: string;
  wikipediaUrl?: string;
}

export type Image = {
  alt?: string;
  downloadUrl?: string;
  imageDb?: boolean;
  sourceUrl?: string;
  url: string;
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
