import { ANIMAL_MALE_ID, HUMAN_MALE_ID } from "../constants/entities";
import { BIRTH_DATE_ID, GENDER_ID } from "../constants/properties";

import { DateTime } from "luxon";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

/*
Sort entities by birth date, youngest child will be on the left, if birth date is unknown they will be on the left side
 */
export function sortByBirthDate(entities: Entity[]) {
  entities.sort((a, b) => {
    const valueA = getSimpleClaimValue(a.simpleClaims, BIRTH_DATE_ID);
    const valueB = getSimpleClaimValue(b.simpleClaims, BIRTH_DATE_ID);
    if (valueA && valueB) {
      return DateTime.fromISO(valueA) > DateTime.fromISO(valueB) ? 1 : -1;
    }
    if (valueA) {
      return 1;
    }
    return -1;
  });
}

export function sortByGender(entities: Entity[]) {
  entities.sort((a, b) => {
    try {
      const aGenderId = getSimpleClaimValue(a.simpleClaims, GENDER_ID);
      return aGenderId === HUMAN_MALE_ID || aGenderId === ANIMAL_MALE_ID
        ? -1
        : 1;
    } catch (error) {
      return -1;
    }
  });
}
