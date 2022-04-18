import {
  WD_ANIMAL_FEMALE,
  WD_ANIMAL_MALE,
  WD_HUMAN_FEMALE,
  WD_HUMAN_MALE,
  WD_SEX_OR_GENDER,
} from "@entitree/helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addGender(entity: Entity) {
  const genderId = getSimpleClaimValue(entity.simpleClaims, WD_SEX_OR_GENDER);
  if (genderId) {
    if (genderId === WD_HUMAN_MALE || genderId === WD_ANIMAL_MALE) {
      entity.gender = "male";
    } else if (genderId === WD_HUMAN_FEMALE || genderId === WD_ANIMAL_FEMALE) {
      entity.gender = "female";
    } else {
      entity.gender = "thirdgender";
    }
  }
}
