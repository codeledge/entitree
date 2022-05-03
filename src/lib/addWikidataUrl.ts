import { Entity } from "types/Entity";
import { getWikidataInstance } from "@entitree/helper";

export default function addWikidataUrl(entity: Entity) {
  entity.wikidataUrl = getWikidataInstance().getSitelinkUrl({
    site: "wikidata",
    title: entity.id,
  });
}
