// import { SettingsState } from "store/settingsSlice";
import wbk from "wikibase-sdk";
import wdk from "wikidata-sdk";

export function wikibaseInstance(instance: string) {
  let wikibaseInstance: any;
  if (instance === "factgrid") {
    wikibaseInstance = wbk({
      instance: "https://database.factgrid.de",
      sparqlEndpoint: "https://database.factgrid.de/sparql",
    });
  } else {
    wikibaseInstance = wdk;
  }
  return wikibaseInstance;
}
