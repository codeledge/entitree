import {
  WDQ_FICTIONAL_HUMAN,
  WDQ_HUMAN,
  WDQ_HUMAN_FETUS,
  WD_INSTANCE_OF,
} from "@entitree/helper";

import { Entity } from "types/Entity";

export default function addIsHuman(entity: Entity) {
  const isHuman = entity.simpleClaims?.[WD_INSTANCE_OF]?.some(
    ({ value }) =>
      value === WDQ_HUMAN ||
      value === WDQ_FICTIONAL_HUMAN ||
      value === WDQ_HUMAN_FETUS,
  );

  if (isHuman) entity.isHuman = isHuman;
}
