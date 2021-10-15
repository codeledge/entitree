import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import { GeniProfile, geniApi } from "services/geniService";
import { sortByBirthDate, sortByGender } from "../../lib/sortEntities";

import { CHILD_ID } from "constants/properties";
import { ConnectorOptions } from "../../lib/addEntityConnectors";
import { Entity } from "types/Entity";
// import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import addGeniEntityConnectors from "./addEntityConnectors";
// import filterSpouses from "./filterSpouses";
import formatGeniProfile from "./formatEntity";

type Options = ConnectorOptions & {
  secondLanguageCode?: LangCode;
  downIdsAlreadySorted?: boolean;
  serverside?: boolean;
  geniAccessToken: string;
};

export default async function getEntities(
  ids: string[],
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> {
  //either use profile or immediate family to query all at once
  const geniProfiles = await geniApi("profile", {
    ids: ids.join(","),
    access_token: options.geniAccessToken,
  });
  // const entities: Entity[] = [];
  // console.log(geniProfiles);

  const entities = await geniProfiles.results.reduce(
    async (acc: Promise<Entity[]>, geniProfile) => {
      const accumulator = await Promise.resolve(acc);

      //get rid of unwanted records
      // if (!wikiEntitiesMap[id] || wikiEntitiesMap[id]["missing"] !== undefined)
      //   return accumulator;

      //add all custom fields
      const entity = formatGeniProfile(geniProfile);

      //filter out isInfantDeath by default
      // if (entity.isHuman && entity.isInfantDeath) {
      //   return accumulator;
      // }
      console.log("options", options);

      // siblings and spouses don't need connectors, so no currentPropId is passed
      if (options?.currentPropId) {
        await addGeniEntityConnectors(entity, options);
      }

      return Promise.resolve([...accumulator, entity]);
    },
    Promise.resolve([]),
  );

  // geniProfiles.results.forEach(async (geniProfile) => {
  //   //add all custom fields
  //   const entity = formatGeniProfile(geniProfile);

  //   addEntityConnectors(entity?.id, options);
  //   console.log(entity);
  //   entities.push(entity);
  // });
  // console.log("entities", entities);

  return entities;
}

export const getRootEntity = async (
  id: string,
  languageCode: LangCode,
  options: Options,
): Promise<Entity> => {
  const [root] = await getEntities([id], languageCode, options);
  // console.log("root", root);
  if (root) root.treeId = "0";

  return root;
};

export const getChildEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.downIds) return [];

  const children = await getEntities(entityNode.downIds, languageCode, options);

  children.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${CHILD_BOOKMARK_SYMBOL}${index}`;
  });

  // if (options?.currentPropId === CHILD_ID && !options?.downIdsAlreadySorted) {
  sortByBirthDate(children);
  // }

  return children;
};

export const getParentEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.upIds) return [];
  const parents = await getEntities(entityNode.upIds, languageCode, options);

  //todo: move this in get Entities
  parents.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${PARENT_BOOKMARK_SYMBOL}${index}`;
  });

  // if (options?.currentPropId === CHILD_ID) {
  sortByGender(parents);
  // }

  return parents;
};

export const getSpouseEntities = async (
  entityNode: EntityNode,
  languageCode: LangCode,
  options: Options,
): Promise<Entity[]> => {
  if (!entityNode.rightIds) return [];

  const spouses = await getEntities(entityNode.rightIds, languageCode, options);
  console.log(spouses);
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
  if (!entityNode.leftIds) return [];

  const siblings = await getEntities(entityNode.leftIds, languageCode, options);

  siblings.forEach((node, index) => {
    node.treeId = `${entityNode.treeId}${SIBLING_BOOKMARK_SYMBOL}${index}`;
  });

  // sortByBirthDate(siblings);

  return siblings;
};
