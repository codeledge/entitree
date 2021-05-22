import addEntityConnectors, { ConnectorOptions } from "./addEntityConnectors";

import { BigEntity } from "types/Entity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { Entity } from "wikibase-types/dist";
import formatEntity from "./formatEntity";
import getWikidataEntities from "wikidata/getWikidataEntities";
import store from "store";

export default async function getEntities(
  ids: Entity["id"][],
  connectorOptions?: ConnectorOptions,
) {
  const languages = DEFAULT_LANGS_CODES;

  const { languageCode, secondLanguageCode } = store.getState().settings;
  if (!languages.includes(languageCode)) languages.push(languageCode);

  if (secondLanguageCode && !languages.includes(secondLanguageCode))
    languages.push(secondLanguageCode);

  const wikiEntitiesMap = await getWikidataEntities({
    ids,
    languages,
  });

  const entities: BigEntity[] = ids.reduce((acc: BigEntity[], id) => {
    if (!wikiEntitiesMap[id] || wikiEntitiesMap[id]["missing"] !== undefined)
      return entities;

    const entity = formatEntity(wikiEntitiesMap[id]);

    // siblings and spouses don't need connectors, so no connectorOptions is passed
    if (connectorOptions) {
      addEntityConnectors(entity, connectorOptions);
    }

    return acc.concat(entity);
  }, []);

  return entities;
}
