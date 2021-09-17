import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  entity: Pick<Entity, "id" | "wikipediaSlug">,
  wikibase: string,
) => {
  let wikibasePrefix = "";
  switch (wikibase) {
    case "wikidata":
      break;
    case "factgrid":
      wikibasePrefix += "/factgrid";
      break;
    default:
      break;
  }
  return `${wikibasePrefix}/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${entity.wikipediaSlug || entity.id}`;
};
