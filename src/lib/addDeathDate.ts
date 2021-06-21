import { DEATH_DATE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import formatDateClaim from "./formatDateClaim";

export default function addDeathDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[DEATH_DATE_ID];
  if (claim) entity.deathDate = formatDateClaim(claim, languageCode);
  if (claim) entity.deathYear = formatDateClaim(claim, languageCode, true);
}
