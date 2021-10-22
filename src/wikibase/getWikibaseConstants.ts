import * as FACTGRID_PROPERTIES from "constants/factgrid/properties";
import * as WIKIDATA_PROPERTIES from "constants/properties";

import { DataSource } from "./getWikibaseInstance";

export default function getWikibaseConstants(dataSource: DataSource) {
  switch (dataSource) {
    case "factgrid":
      return FACTGRID_PROPERTIES;

    default:
    case "wikidata":
      return WIKIDATA_PROPERTIES;
  }
}
