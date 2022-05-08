import {
  WDQ_ANIMAL_FEMALE,
  WDQ_ANIMAL_MALE,
  WDQ_HUMAN_FEMALE,
  WDQ_HUMAN_MALE,
  WD_SEX_OR_GENDER,
} from "@entitree/helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addGender(entity: Entity) {
  const genderId = getSimpleClaimValue(entity.simpleClaims, WD_SEX_OR_GENDER);
  if (genderId) {
    if (genderId === WDQ_HUMAN_MALE || genderId === WDQ_ANIMAL_MALE) {
      entity.gender = "male";
    } else if (
      genderId === WDQ_HUMAN_FEMALE ||
      genderId === WDQ_ANIMAL_FEMALE
    ) {
      entity.gender = "female";
    } else {
      entity.gender = "thirdgender";
    }
  }
}
