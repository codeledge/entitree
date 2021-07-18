import addEntityConnectors, { ConnectorOptions } from "./addEntityConnectors";
import { sortByBirthDate, sortByGender } from "./sortEntities";

import { CHILD_ID } from "constants/properties";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import filterSpouses from "./filterSpouses";
import formatEntity from "./formatEntity";
import getWikidataEntities from "wikidata/getWikidataEntities";

type Options = ConnectorOptions & {
  secondLanguageCode?: LangCode;
  downIdsAlreadySorted?: boolean;
};

export default async function getEntities(
  ids: string[],
  languageCode: LangCode,
  options?: Options,
): Promise<Entity[]> {
  const languages = DEFAULT_LANGS_CODES;

  if (!languages.includes(languageCode)) languages.push(languageCode);

  if (
    options?.secondLanguageCode &&
    !languages.includes(options.secondLanguageCode)
  )
    languages.push(options.secondLanguageCode);

  const wikiEntitiesMap = await getWikidataEntities({
    ids,
    languages,
  });

  const entities = await ids.reduce(async (acc: Promise<Entity[]>, id) => {
    const accumulator = await Promise.resolve(acc);

    if (!wikiEntitiesMap[id] || wikiEntitiesMap[id]["missing"] !== undefined)
      return accumulator;

    const entity = formatEntity(wikiEntitiesMap[id], languageCode);

    //filter out isInfantDeath by default
    if (entity.isHuman && entity.isInfantDeath) {
      return accumulator;
    }

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
  options?: Options,
): Promise<Entity> => {
  const [root] = await getEntities([id], languageCode, options);

  return root;
};

export const getChildEntities = async (
  ids: string[],
  languageCode: LangCode,
  options?: Options,
): Promise<Entity[]> => {
  const children = await getEntities(ids, languageCode, options);

  if (options?.currentPropId === CHILD_ID) {
    sortByBirthDate(children);
  }

  return children;
};

export const getParentEntities = async (
  ids: string[],
  languageCode: LangCode,
  options?: Options,
): Promise<Entity[]> => {
  if (!ids) return [];

  const parents = await getEntities(ids, languageCode, options);

  if (options?.currentPropId === CHILD_ID) {
    sortByGender(parents);
  }

  return parents;
};

export const getSpouseEntities = async (
  ids: string[],
  languageCode: LangCode,
  options?: Options,
): Promise<Entity[]> => {
  const spouses = await getEntities(ids, languageCode, options);

  //TODO: not doing anything ATM, leave an example!
  filterSpouses(spouses);

  return spouses;
};

export const getSiblingEntities = async (
  ids: string[],
  languageCode: LangCode,
  options?: Options,
): Promise<Entity[]> => {
  const siblings = await getEntities(ids, languageCode, options);

  sortByBirthDate(siblings);

  return siblings;
};
