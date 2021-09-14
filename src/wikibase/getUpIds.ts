import axios from "axios";
import wdk from "wikidata-sdk";

export default async function getUpIds(
  entityId: string,
  propId: string,
): Promise<string[]> {
  const url = wdk.getReverseClaims(propId, entityId);

  const { data } = await axios.get(url);

  //TODO: get ids directly without simplify
  const ids = wdk.simplify.sparqlResults(data).map(({ subject }) => subject);

  return ids;
}
