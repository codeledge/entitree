import { BIRTH_DATE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import formatDateClaim from "./formatDateClaim";

export default function addBirthDate(entity: Entity, languageCode) {
  const claim = entity.claims?.[BIRTH_DATE_ID];

  if (claim) entity.birthDate = formatDateClaim(claim, languageCode);
  if (claim) entity.birthYear = formatDateClaim(claim, languageCode, true);
}
