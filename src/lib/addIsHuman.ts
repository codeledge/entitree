import {
  WD_FICTIONAL_HUMAN,
  WD_HUMAN,
  WD_HUMAN_FETUS,
  WD_INSTANCE_OF,
} from "@entitree/wikidata-helper";

import { Entity } from "types/Entity";

export default function addIsHuman(entity: Entity) {
  const isHuman = entity.simpleClaims?.[WD_INSTANCE_OF]?.some(
    ({ value }) =>
      value === WD_HUMAN ||
      value === WD_FICTIONAL_HUMAN ||
      value === WD_HUMAN_FETUS,
  );

  if (isHuman) entity.isHuman = isHuman;
}
