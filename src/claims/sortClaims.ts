import { Claim } from "types/Claim";
import { DateTime } from "luxon";
import { START_DATE_ID } from "constants/properties";
import { getTimeQualifier } from "./getTimeQualifier";

export function sortClaimsByStartDate(claims: Claim[]) {
  return claims
    .sort((a, b) => {
      const startDateA = getTimeQualifier(a, START_DATE_ID);
      const startDateB = getTimeQualifier(b, START_DATE_ID);
      try {
        return startDateA &&
          startDateB &&
          DateTime.fromISO(startDateA) < DateTime.fromISO(startDateB)
          ? 1
          : -1;
      } catch (error) {
        return 1;
      }
    })
    .map(({ mainsnak }) => {
      try {
        return mainsnak.datavalue?.value["id"]; //for 'No value' and 'Unknown'
      } catch (error) {
        return null;
      }
    })
    .filter((id, index, ids) => {
      // Filter out 'No value' and 'Unknown'
      // Filter people married twice with same person (e.g. elon musk -> Talulah Riley)
      return id && ids.indexOf(id) === index;
    });
}
