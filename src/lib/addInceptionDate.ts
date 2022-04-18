import { WD_INCEPTION, formatDateClaim } from "@entitree/helper";

import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addInceptionDate(
  entity: Entity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[WD_INCEPTION];
  if (claim) entity.inceptionDate = formatDateClaim(claim, languageCode);
}
