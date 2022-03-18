import { WD_DATE_OF_BIRTH, WD_DATE_OF_DEATH } from "@entitree/helper";

import { DateTime } from "luxon";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addIsInfantDeath(entity: Entity) {
  if (
    entity.simpleClaims?.[WD_DATE_OF_DEATH] &&
    entity.simpleClaims?.[WD_DATE_OF_BIRTH]
  ) {
    try {
      entity.isInfantDeath =
        DateTime.fromISO(
          getSimpleClaimValue(entity.simpleClaims, WD_DATE_OF_DEATH)!,
        ).year -
          DateTime.fromISO(
            getSimpleClaimValue(entity.simpleClaims, WD_DATE_OF_BIRTH)!,
          ).year <
        5;

      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}
