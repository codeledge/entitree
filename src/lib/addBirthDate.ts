import formatDateClaim, { getDateClaimISO } from "./formatDateClaim";

import { BIRTH_DATE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addBirthDate(entity: Entity, languageCode: LangCode) {
  const birthDateClaims = entity.claims?.[BIRTH_DATE_ID];

  if (birthDateClaims) {
    entity.birthISO = getDateClaimISO(birthDateClaims);
    entity.birthDate = formatDateClaim(birthDateClaims, languageCode);
    entity.birthYear = formatDateClaim(birthDateClaims, languageCode, true);
  }
}
