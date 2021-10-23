import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { DataSource } from "wikibase/getWikibaseInstance";
import { LangCode } from "types/Lang";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  entitySlug: string,
  dataSource: DataSource,
) => {
  let dataSourcePrefix = "";
  switch (dataSource) {
    case "wikidata":
      break;
    case "factgrid":
      dataSourcePrefix += "/factgrid";
      break;
    case "geni":
      dataSourcePrefix += "/geni";
      break;
    default:
      break;
  }
  return `${dataSourcePrefix}/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${encodeURIComponent(entitySlug)}`;
};
