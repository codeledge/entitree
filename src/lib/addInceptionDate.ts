import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WD_INCEPTION } from "@entitree/helper";
import formatDateClaim from "./formatDateClaim";

export default function addInceptionDate(
  entity: Entity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[WD_INCEPTION];
  if (claim) entity.inceptionDate = formatDateClaim(claim, languageCode);
}
