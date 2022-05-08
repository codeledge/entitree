import * as FACTGRID_PROPERTIES from "constants/factgrid/properties";
import * as WIKIDATA_PROPERTIES from "constants/properties";

import { DataSource } from "@entitree/helper";

export default function getWikibaseConstants(dataSource: DataSource) {
  switch (dataSource) {
    case "factgrid":
      return FACTGRID_PROPERTIES;
    case "wikidata":
    default:
      return WIKIDATA_PROPERTIES;
  }
}
