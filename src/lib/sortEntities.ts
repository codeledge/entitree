import { DateTime } from "luxon";
import { Entity } from "types/Entity";

/*
  Sort entities by birth date, youngest child will be on the left, 
  if birth date is unknown they will be on the left side
 */
export function sortByBirthDate(entities: Entity[]) {
  entities.sort((a, b) => {
    const valueA = a.birthISO;
    const valueB = b.birthISO;
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
  entities.sort((a) => {
    try {
      return a.gender === "male" ? -1 : 1;
    } catch (error) {
      return -1;
    }
  });
}
