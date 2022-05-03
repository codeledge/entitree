import { DataSource, getWikibaseEntities } from "@entitree/helper";
import { Entity, WikibaseEntity } from "types/Entity";

import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { LangCode } from "types/Lang";
import addLabel from "../lib/addLabel";

export default async function getWikibaseEntitiesLabel(
  ids: string[],
  languageCode: LangCode,
  dataSource: DataSource,
) {
  if (!ids || !ids.length)
    throw new Error("You need valid ids to getItemsLabel");

  const allentities = await getWikibaseEntities({
    ids,
    languages: [languageCode].concat(DEFAULT_LANGS_CODES),
    props: ["labels"],
    dataSource,
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
