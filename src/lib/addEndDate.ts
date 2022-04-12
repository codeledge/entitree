import { WD_END_TIME, formatDateClaim } from "@entitree/helper";

import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addEndDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[WD_END_TIME];
  if (claim) entity.endDate = formatDateClaim(claim, languageCode);
}
