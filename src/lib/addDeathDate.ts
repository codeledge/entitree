import { WD_DATE_OF_DEATH, formatDateClaim } from "@entitree/helper";

import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addDeathDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[WD_DATE_OF_DEATH];
  if (claim) entity.deathDate = formatDateClaim(claim, languageCode);
  if (claim) entity.deathYear = formatDateClaim(claim, languageCode, true);
}
