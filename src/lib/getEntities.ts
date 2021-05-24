import addEntityConnectors, { ConnectorOptions } from "./addEntityConnectors";

import { BigEntity } from "types/Entity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { LangCode } from "types/Lang";
import formatEntity from "./formatEntity";
import getWikidataEntities from "wikidata/getWikidataEntities";

type Options = ConnectorOptions & {
  secondLanguageCode?: LangCode;
};

export default async function getEntities(
  ids: string[],
  languageCode: LangCode,
  options?: Options,
) {
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

  const entities: BigEntity[] = ids.reduce((acc: BigEntity[], id) => {
    if (!wikiEntitiesMap[id] || wikiEntitiesMap[id]["missing"] !== undefined)
      return acc;

    const entity = formatEntity(wikiEntitiesMap[id]);

    // siblings and spouses don't need connectors, so no currentPropId is passed
    if (options?.currentPropId) {
      addEntityConnectors(entity, options);
    }

    return acc.concat(entity);
  }, []);

  return entities;
}
