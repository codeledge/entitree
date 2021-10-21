import { DataSource, getWikibaseInstance } from "wikibase/getWikibaseInstance";

import axios from "axios";

export default async function getUpIds(
  entityId: string,
  propId: string,
  dataSource: DataSource,
): Promise<string[]> {
  const wikibaseInstance = getWikibaseInstance(dataSource);

  const url = wikibaseInstance.getReverseClaims(propId, entityId);
  const { data } = await axios.get(url);

  //TODO: get ids directly without simplify
  const ids = wikibaseInstance.simplify
    .sparqlResults(data)
    .map(({ subject }) => subject);

  return ids;
}
