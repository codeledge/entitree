import formatDateClaim, { getDateClaimISO } from "./formatDateClaim";

import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WD_DATE_OF_BIRTH } from "@entitree/wikidata-helper";

export default function addBirthDate(entity: Entity, languageCode: LangCode) {
  const birthDateClaims = entity.claims?.[WD_DATE_OF_BIRTH];

  if (birthDateClaims) {
    const birthISO = getDateClaimISO(birthDateClaims);
    if (birthISO) entity.birthISO = birthISO;
    const birthDate = formatDateClaim(birthDateClaims, languageCode);
    if (birthDate) entity.birthDate = birthDate;
    const birthYear = formatDateClaim(birthDateClaims, languageCode, true);
    if (birthYear) entity.birthYear = birthYear;
  }
}
