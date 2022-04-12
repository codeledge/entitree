import { WD_START_TIME, formatDateClaim } from "@entitree/helper";

import { Entity } from "types/Entity";
import { Lang } from "../types/Lang";

export default function addStartDate(
  entity: Entity,
  languageCode: Lang["code"],
) {
  const claim = entity.claims?.[WD_START_TIME];
  if (claim) entity.startDate = formatDateClaim(claim, languageCode);
}
