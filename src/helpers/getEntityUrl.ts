import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { DataSource } from "wikibase/getWikibaseInstance";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  entity: Pick<Entity, "id" | "wikipediaSlug">,
  dataSource: DataSource,
) => {
  let wikibasePrefix = "";
  let slug = "";
  switch (dataSource) {
    case "wikidata":
      slug = entity.wikipediaSlug || entity.id;
      break;
    case "factgrid":
      wikibasePrefix += "/factgrid";
      slug = entity.id; //factgrid not supporting slug at the moment
      break;
    default:
      break;
  }
  return `${wikibasePrefix}/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${encodeURIComponent(slug)}`;
};
