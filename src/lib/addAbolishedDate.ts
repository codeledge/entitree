import {
  WD_DISSOLVED_ABOLISHED_OR_DEMOLISHED_DATE,
  formatDateClaim,
} from "@entitree/helper";

import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addAbolishedDate(
  entity: Entity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[WD_DISSOLVED_ABOLISHED_OR_DEMOLISHED_DATE];
  if (claim) entity.abolishedDate = formatDateClaim(claim, languageCode);
}
