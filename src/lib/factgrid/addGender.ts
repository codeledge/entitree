import {
  ANIMAL_FEMALE_ID,
  ANIMAL_MALE_ID,
  HUMAN_FEMALE_ID,
  HUMAN_MALE_ID,
} from "constants/factgrid/entities";

import { Entity } from "types/Entity";
import { GENDER_ID } from "constants/factgrid/properties";
import getSimpleClaimValue from "../getSimpleClaimValue";

export default function addFactgridGender(entity: Entity) {
  const genderId = getSimpleClaimValue(entity.simpleClaims, GENDER_ID);
  if (genderId) {
    if (genderId === HUMAN_MALE_ID || genderId === ANIMAL_MALE_ID) {
      entity.gender = "male";
    } else if (genderId === HUMAN_FEMALE_ID || genderId === ANIMAL_FEMALE_ID) {
      entity.gender = "female";
    } else {
      entity.gender = "thirdgender";
    }
  }
}
