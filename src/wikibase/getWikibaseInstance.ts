import wbk from "wikibase-sdk";
import wdk from "wikidata-sdk";

export type DataSource = "wikidata" | "factgrid" | "geni";

export function getWikibaseInstance(alias: DataSource) {
  let wikibaseInstance: any;
  if (alias === "factgrid") {
    wikibaseInstance = wbk({
      instance: "https://database.factgrid.de",
      sparqlEndpoint: "https://database.factgrid.de/sparql",
    });
  } else {
    wikibaseInstance = wdk;
  }
  return wikibaseInstance;
}
