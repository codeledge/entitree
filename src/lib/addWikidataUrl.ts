import { BigEntity } from "types/Entity";
import wbk from "wikidata-sdk";

export default function addWikidataUrl(entity: BigEntity) {
  entity.wikidataUrl = wbk.getSitelinkUrl({
    site: "wikidata",
    title: entity.id,
  });
}
