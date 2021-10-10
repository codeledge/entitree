import * as FACTGRID_PROPERTIES from "constants/factgrid/properties";
import * as WIKIDATA_PROPERTIES from "constants/properties";

import { WikibaseAlias } from "./getWikibaseInstance";

export default function getWikibaseConstants(wikibaseAlias: WikibaseAlias) {
  switch (wikibaseAlias) {
    case "factgrid":
      return FACTGRID_PROPERTIES;

    default:
    case "wikidata":
      return WIKIDATA_PROPERTIES;
  }
}
