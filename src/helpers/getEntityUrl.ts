import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { DataSource } from "@entitree/helper";
import { LangCode } from "types/Lang";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  dataSource: DataSource,
  entityId: string,
  wikipediaSlug?: string,
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

  const entitySlug =
    wikipediaSlug && /^[a-z0-9\-_ ,()]+$/.test(wikipediaSlug)
      ? wikipediaSlug
      : entityId;

  return `${dataSourcePrefix}/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${encodeURIComponent(entitySlug)}`;
};
