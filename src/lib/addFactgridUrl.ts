import { Entity } from "types/Entity";

export default function addFactgridUrl(entity: Entity) {
  entity.wikidataUrl = "https://database.factgrid.de/wiki/Item:" + entity.id;
}
