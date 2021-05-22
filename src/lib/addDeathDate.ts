import formatDateClaim from "./formatDateClaim";
import { DEATH_DATE_ID } from "../constants/properties";

export default function addDeathDate(entity, languageCode) {
  const claim = entity.claims[DEATH_DATE_ID];
  if (claim) entity.deathDate = formatDateClaim(claim, languageCode);
  if (claim) entity.deathYear = formatDateClaim(claim, languageCode, true);
}
