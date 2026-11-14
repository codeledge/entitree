import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import { WD_CHILD, getWikibaseEntities } from "@entitree/helper";
import addEntityConnectors, {
  ConnectorOptions,
} from "../lib/addEntityConnectors";
import {
  getGeniImmediateFamilyCall,
  getGeniProfilesCall,
} from "services/apiService";
import { sortByBirthDate, sortByGender } from "../lib/sortEntities";

import { LABEL_FALLBACK_LANGS } from "../constants/langs";
import { Entity, WikibaseEntity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import { addGeniEntityConnectors } from "lib/geni/addGeniEntityConnectors";
// import filterSpouses from "../lib/filterSpouses";
import { formatGeniProfile } from "../lib/formatGeniProfile";
import formatWikibaseEntity from "../lib/formatWikibaseEntity";
import getEntitiesSourceIds from "wikibase/getWikibaseSourceIds";

type Options = ConnectorOptions & {
  secondLanguageCode?: LangCode;
  areTargetIdsSorted?: boolean;
};

export default async function getEntities(
  ids: string[],
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> {
  if (!ids?.length) return [];

  if (options.dataSource === "geni") {
    const profiles = await getGeniProfilesCall(ids);

    const immediateFamilies = await getGeniImmediateFamilyCall(ids);

    const entities = profiles.map((profile, index) => {
      const formattedEntity = formatGeniProfile(profile);
      addGeniEntityConnectors(
        formattedEntity,
        immediateFamilies[index],
        options,
      );
      return formattedEntity;
    });

    return entities;
  }

  const wikibaseEntitiesMap = await fetchWikibaseEntitiesMap(
    ids,
    languageCode,
    options,
  );

  return buildEntities(ids, wikibaseEntitiesMap, languageCode, options);
}

export type WikibaseEntitiesMap = Record<string, WikibaseEntity>;

// Raw wikibase entities (with claims), before formatting
export function fetchWikibaseEntitiesMap(
  ids: string[],
  languageCode: LangCode,
  options: Pick<Options, "dataSource" | "secondLanguageCode">,
): Promise<WikibaseEntitiesMap> {
  const languages = [...LABEL_FALLBACK_LANGS];

  //avoid duplicate language, but it won't break anyway
  if (!languages.includes(languageCode)) languages.push(languageCode);

  if (
    options?.secondLanguageCode &&
    !languages.includes(options.secondLanguageCode)
  )
    languages.push(options.secondLanguageCode);

  return getWikibaseEntities({
    ids,
    languages,
    dataSource: options.dataSource,
  });
}

// Format raw wikibase entities and add the connectors (parents, children...)
export async function buildEntities(
  ids: string[],
  wikibaseEntitiesMap: WikibaseEntitiesMap,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> {
  const entities = ids
    //get rid of unwanted records
    .filter(
      (id) =>
        wikibaseEntitiesMap[id] &&
        wikibaseEntitiesMap[id]["missing"] === undefined,
    )
    //add all custom fields
    .map((id) =>
      formatWikibaseEntity(
        wikibaseEntitiesMap[id],
        languageCode,
        options?.dataSource,
      ),
    );

  // one batched lookup for all entities instead of one query per entity
  const sourceIdsMap =
    options?.currentPropId && options.addSourceIds
      ? await getEntitiesSourceIds(
          entities,
          options.currentPropId,
          options.dataSource,
        )
      : {};

  entities.forEach((entity) => {
    // siblings and spouses don't need connectors, so no currentPropId is passed
    if (options?.currentPropId) {
      addEntityConnectors(entity, options, sourceIdsMap[entity.id]);
    }

    //delete as non-serializeable and save on memory
    delete entity.claims;
    delete entity.simpleClaims;
  });

  return entities;
}

export const getRootEntity = async (
  id: string,
  languageCode: LangCode,
  options: Options,
): Promise<Entity> => {
  const [root] = await getEntities([id], languageCode, options);

  if (root) root.treeId = "0";

  return root;
};

export const getChildEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.targetIds) return [];

  const children = await getEntities(
    entityNode.targetIds,
    languageCode,
    options,
  );

  children.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${CHILD_BOOKMARK_SYMBOL}${index}`;
  });

  if (options?.currentPropId === WD_CHILD && !options?.areTargetIdsSorted) {
    sortByBirthDate(children);
  }

  return children;
};

export const getParentEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.sourceIds) return [];

  const parents = await getEntities(
    entityNode.sourceIds,
    languageCode,
    options,
  );

  //todo: move this in get Entities
  parents.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${PARENT_BOOKMARK_SYMBOL}${index}`;
  });

  if (options?.currentPropId === WD_CHILD) {
    sortByGender(parents);
  }

  return parents;
};

export const getSpouseEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.nextAfterIds) return [];

  const spouses = await getEntities(
    entityNode.nextAfterIds,
    languageCode,
    options,
  );

  spouses.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${SPOUSE_BOOKMARK_SYMBOL}${index}`;
  });

  //TODO: not doing anything ATM, leave an example!
  // filterSpouses(spouses);

  return spouses;
};

export const getSiblingEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.nextBeforeIds) return [];

  const siblings = await getEntities(
    entityNode.nextBeforeIds,
    languageCode,
    options,
  );

  siblings.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${SIBLING_BOOKMARK_SYMBOL}${index}`;
  });

  sortByBirthDate(siblings);

  return siblings;
};
