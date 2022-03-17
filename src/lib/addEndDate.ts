import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WD_END_TIME } from "@entitree/wikidata-helper";
import formatDateClaim from "./formatDateClaim";

export default function addEndDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[WD_END_TIME];
  if (claim) entity.endDate = formatDateClaim(claim, languageCode);
}
