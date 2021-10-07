import { Entity } from "types/Entity";
import { HUMAN_ID } from "constants/factgrid/entities";
import { INSTANCE_OF_ID } from "constants/factgrid/properties";

export default function addFactgridIsHuman(entity: Entity) {
  const isHuman = entity.simpleClaims?.[INSTANCE_OF_ID]?.some(
    ({ value }) => value === HUMAN_ID || value === "Q8811",
  );

  if (isHuman) entity.isHuman = isHuman;
}
