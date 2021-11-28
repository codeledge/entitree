import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import addEntityConnectors, {
  ConnectorOptions,
} from "../lib/addEntityConnectors";
import {
  getGeniImmediateFamilyCall,
  getGeniProfilesCall,
} from "services/apiService";
import { sortByBirthDate, sortByGender } from "../lib/sortEntities";

import { CHILD_ID } from "constants/properties";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import { addGeniEntityConnectors } from "lib/geni/addGeniEntityConnectors";
import filterSpouses from "../lib/filterSpouses";
import { formatGeniProfile } from "../lib/formatGeniProfile";
import formatWikibaseEntity from "../lib/formatWikibaseEntity";
import getWikibaseEntities from "wikibase/getWikibaseEntities";

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

  const languages = DEFAULT_LANGS_CODES;

  //avoid duplicate language, but it won't break anyway
  if (!languages.includes(languageCode)) languages.push(languageCode);

  if (
    options?.secondLanguageCode &&
    !languages.includes(options.secondLanguageCode)
  )
    languages.push(options.secondLanguageCode);

  const wikibaseEntitiesMap = await getWikibaseEntities({
    ids,
    languages,
    dataSource: options.dataSource,
  });

  const entities = await ids.reduce(async (acc: Promise<Entity[]>, id) => {
    const accumulator = await Promise.resolve(acc);

    //get rid of unwanted records
    if (
      !wikibaseEntitiesMap[id] ||
      wikibaseEntitiesMap[id]["missing"] !== undefined
    )
      return accumulator;

    //add all custom fields
    const entity = formatWikibaseEntity(
      wikibaseEntitiesMap[id],
      languageCode,
      options?.dataSource,
    );

    // siblings and spouses don't need connectors, so no currentPropId is passed
    if (options?.currentPropId) {
      await addEntityConnectors(entity, options);
    }

    //delete as non-serializeable and save on memory
    delete entity.claims;
    delete entity.simpleClaims;

    return Promise.resolve([...accumulator, entity]);
  }, Promise.resolve([]));

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

  if (options?.currentPropId === CHILD_ID && !options?.areTargetIdsSorted) {
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

  if (options?.currentPropId === CHILD_ID) {
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
  filterSpouses(spouses);

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
