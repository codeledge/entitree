import axios from "axios";
import { wikibaseInstance } from "lib/wikibaseInstance";

export default async function getUpIds(
  entityId: string,
  propId: string,
  wikibase: string,
): Promise<string[]> {
  const wdk = wikibaseInstance(wikibase);

  const url = wdk.getReverseClaims(propId, entityId);
  const { data } = await axios.get(url);

  //TODO: get ids directly without simplify
  const ids = wdk.simplify.sparqlResults(data).map(({ subject }) => subject);

  return ids;
}
