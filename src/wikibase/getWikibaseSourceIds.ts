import {
  DataSource,
  WD_CHILD,
  WD_FATHER,
  WD_MOTHER,
  getWikibaseInstance,
} from "@entitree/helper";

import { Entity } from "types/Entity";
import axios from "axios";
import getClaimIds from "lib/getClaimIds";

// Keeps the GET url short; chunks are queried in parallel
const SPARQL_BATCH_SIZE = 50;

/**
 * Reverse lookup for many entities in one SPARQL query per chunk:
 * returns, for each id, the ids of the items that have `propId` pointing to it.
 */
export async function getWikibaseSourceIdsMap(
  entityIds: string[],
  propId: string,
  dataSource: DataSource,
): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  entityIds.forEach((id) => {
    map[id] = [];
  });
  if (!entityIds.length) return map;

  const wikibaseInstance = getWikibaseInstance(dataSource);

  const chunks: string[][] = [];
  for (let i = 0; i < entityIds.length; i += SPARQL_BATCH_SIZE) {
    chunks.push(entityIds.slice(i, i + SPARQL_BATCH_SIZE));
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      const query = `SELECT ?item ?subject WHERE {
  VALUES ?item { ${chunk.map((id) => `wd:${id}`).join(" ")} }
  ?subject wdt:${propId} ?item .
  FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . }
}`;
      const { data } = await axios.get(wikibaseInstance.sparqlQuery(query));

      wikibaseInstance.simplify
        .sparqlResults(data)
        .forEach(({ item, subject }: { item: string; subject: string }) => {
          if (map[item] && !map[item].includes(subject)) map[item].push(subject);
        });
    }),
  );

  return map;
}

/**
 * Source (parent) ids for every entity.
 * On Wikidata family trees the father/mother claims are used, and the SPARQL
 * reverse lookup only runs for the entities missing one of them.
 * Must be called before the claims are deleted from the entities.
 */
export default async function getEntitiesSourceIds(
  entities: Entity[],
  propId: string,
  dataSource: DataSource,
): Promise<Record<string, string[]>> {
  const isFamilyTree = dataSource === "wikidata" && propId === WD_CHILD;

  if (!isFamilyTree) {
    return getWikibaseSourceIdsMap(
      entities.map(({ id }) => id),
      propId,
      dataSource,
    );
  }

  const sourceIdsMap: Record<string, string[]> = {};
  const idsToLookup: string[] = [];

  entities.forEach((entity) => {
    const fatherIds = getClaimIds(entity, WD_FATHER);
    const motherIds = getClaimIds(entity, WD_MOTHER);
    sourceIdsMap[entity.id] = [...new Set([...fatherIds, ...motherIds])];
    if (!fatherIds.length || !motherIds.length) idsToLookup.push(entity.id);
  });

  const reverseMap = await getWikibaseSourceIdsMap(
    idsToLookup,
    propId,
    dataSource,
  );

  Object.entries(reverseMap).forEach(([id, reverseIds]) => {
    reverseIds.forEach((reverseId) => {
      if (!sourceIdsMap[id].includes(reverseId))
        sourceIdsMap[id].push(reverseId);
    });
  });

  return sourceIdsMap;
}
