import { BIRTH_DATE_ID, DEATH_DATE_ID } from "../constants/properties";

import { DateTime } from "luxon";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addIsInfantDeath(entity: Entity) {
  if (
    entity.simpleClaims?.[DEATH_DATE_ID] &&
    entity.simpleClaims?.[BIRTH_DATE_ID]
  ) {
    try {
      entity.isInfantDeath =
        DateTime.fromISO(
          getSimpleClaimValue(entity.simpleClaims, DEATH_DATE_ID)!,
        ).year -
          DateTime.fromISO(
            getSimpleClaimValue(entity.simpleClaims, BIRTH_DATE_ID)!,
          ).year <
        5;

      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}
