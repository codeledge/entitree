import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WikibaseAlias } from "wikibase/getWikibaseInstance";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  entity: Pick<Entity, "id" | "wikipediaSlug">,
  wikibaseAlias: WikibaseAlias,
) => {
  let wikibasePrefix = "";
  let slug = "";
  switch (wikibaseAlias) {
    case "wikidata":
      slug = entity.wikipediaSlug || entity.id;
      break;
    case "factgrid":
      wikibasePrefix += "/factgrid";
      slug = entity.id; //factgrid not supporting slug at the moment
      break;
    case "geni":
      wikibasePrefix += "/geni";
      slug = entity.id; //factgrid not supporting slug at the moment
      break;
    default:
      break;
  }
  return `${wikibasePrefix}/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${encodeURIComponent(slug)}`;
};
