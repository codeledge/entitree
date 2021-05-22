import { Entity, Sitelink } from "wikibase-types/dist";

export type WikiEntity = Entity;

export interface BigEntity extends WikiEntity {
  description?: string;
  label?: string;
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
  sitelink?: Sitelink;
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
}

export type Image = {
  url: string;
  alt: string;
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
