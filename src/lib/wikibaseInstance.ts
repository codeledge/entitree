import wbk from "wikibase-sdk";
import wdk from "wikidata-sdk";

export function wikibaseInstance() {
  const instance = "wikidata";

  let wikibaseInstance: any;
  if (instance === "factgrid") {
    wikibaseInstance = wbk({
      instance: "https://database.factgrid.de",
      sparqlEndpoint: "https://database.factgrid.de/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
    });
  } else {
    wikibaseInstance = wdk;
  }
  return wikibaseInstance;
}
// export const baseURL = "https://database.factgrid.de";
// export const baseDomain = "database.factgrid.de";
export const baseDomain = "www.wikidata.org";
export const baseURL = "https://www.wikidata.org/";
