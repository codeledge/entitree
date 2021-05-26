import { Entity } from "types/Entity";
import { Lang } from "../types/Lang";
import { START_DATE_ID } from "../constants/properties";
import formatDateClaim from "./formatDateClaim";

export default function addStartDate(
  entity: Entity,
  languageCode: Lang["code"],
) {
  const claim = entity.claims?.[START_DATE_ID];
  if (claim) entity.startDate = formatDateClaim(claim, languageCode);
}
