import { Entity, WikibaseEntity } from "types/Entity";

import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { LangCode } from "types/Lang";
import { WikibaseAlias } from "wikibase/getWikibaseInstance";
import addLabel from "../lib/addLabel";
import getWikibaseEntities from "wikibase/getWikibaseEntities";

export default async function getWikibaseEntitiesLabel(
  ids: string[],
  languageCode: LangCode,
  wikibaseAlias: WikibaseAlias,
) {
  if (!ids || !ids.length)
    throw new Error("You need valid ids to getItemsLabel");

  const allentities = await getWikibaseEntities({
    ids,
    languages: [languageCode].concat(DEFAULT_LANGS_CODES),
    props: ["labels"],
    wikibaseAlias,
  });

  const labels = Object.values(allentities).map(
    (wikidataEntity: WikibaseEntity) => {
      const entity: Entity = {
        ...wikidataEntity,
      };
      addLabel(entity, languageCode);
      return entity.label;
    },
  );

  return labels;
}
