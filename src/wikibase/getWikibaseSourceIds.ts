import {
  WikibaseAlias,
  getWikibaseInstance,
} from "wikibase/getWikibaseInstance";

import axios from "axios";

export default async function getUpIds(
  entityId: string,
  propId: string,
  wikibaseAlias: WikibaseAlias,
): Promise<string[]> {
  const wikibaseInstance = getWikibaseInstance(wikibaseAlias);

  const url = wikibaseInstance.getReverseClaims(propId, entityId);
  const { data } = await axios.get(url);

  //TODO: get ids directly without simplify
  const ids = wikibaseInstance.simplify
    .sparqlResults(data)
    .map(({ subject }) => subject);

  return ids;
}
