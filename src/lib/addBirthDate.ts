import formatDateClaim, { getDateClaimISO } from "./formatDateClaim";

import { BIRTH_DATE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addBirthDate(entity: Entity, languageCode: LangCode) {
  const birthDateClaims = entity.claims?.[BIRTH_DATE_ID];

  if (birthDateClaims) {
    const birthISO = getDateClaimISO(birthDateClaims);
    if (birthISO) entity.birthISO = birthISO;
    const birthDate = formatDateClaim(birthDateClaims, languageCode);
    if (birthDate) entity.birthDate = birthDate;
    const birthYear = formatDateClaim(birthDateClaims, languageCode, true);
    if (birthYear) entity.birthYear = birthYear;
  }
}
