import { Entity } from "types/Entity";
import wbk from "wikidata-sdk";

export default function addWikidataUrl(entity: Entity) {
  entity.wikidataUrl = wbk.getSitelinkUrl({
    site: "wikidata",
    title: entity.id,
  });
}
