import { Entity } from "types/Entity";

export default function addFactgridUrl(entity: Entity) {
  entity.factgridUrl = "https://database.factgrid.de/wiki/Item:" + entity.id;
}
