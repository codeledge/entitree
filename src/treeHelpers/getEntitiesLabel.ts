import { DEFAULT_LANGS_CODES } from "../constants/langs";
import { Entity } from "types/Entity";
import addLabel from "../lib/addLabel";
import getWikidataEntities from "wikidata/getWikidataEntities";

export default async function getEntitiesLabel(ids, languageCode) {
  if (!ids || !ids.length)
    throw new Error("You need valid ids to getItemsLabel");

  const allentities = await getWikidataEntities({
    ids,
    languages: [languageCode].concat(DEFAULT_LANGS_CODES),
    props: ["labels"],
  });

  const labels = Object.values(allentities).map((entity: Entity) => {
    addLabel(entity, languageCode);
    return entity.label;
  });

  return labels;
}