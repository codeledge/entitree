import { Entity } from "types/Entity";
import { Lang } from "../types/Lang";
import { WD_START_TIME } from "@entitree/helper";
import formatDateClaim from "./formatDateClaim";

export default function addStartDate(
  entity: Entity,
  languageCode: Lang["code"],
) {
  const claim = entity.claims?.[WD_START_TIME];
  if (claim) entity.startDate = formatDateClaim(claim, languageCode);
}
