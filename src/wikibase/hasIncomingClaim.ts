import { DataSource, getWikibaseInstance } from "@entitree/helper";
import memoryCache, { HOUR } from "lib/memoryCache";

import axios from "axios";

/**
 * Whether any item points to `id` with `propId` (e.g. someone lists it as their child).
 * A cheap ASK query with a fixed predicate, unlike the full props query.
 */
export default function hasIncomingClaim(
  id: string,
  propId: string,
  dataSource: DataSource,
): Promise<boolean> {
  return memoryCache(
    `incomingClaim:${dataSource}:${propId}:${id}`,
    HOUR,
    async () => {
      const query = `ASK { ?s wdt:${propId} wd:${id} . }`;
      const url = getWikibaseInstance(dataSource).sparqlQuery(query);
      const { data } = await axios.get(url);

      return Boolean(data?.boolean);
    },
  );
}
