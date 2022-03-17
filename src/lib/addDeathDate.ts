import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WD_DATE_OF_DEATH } from "@entitree/wikidata-helper";
import formatDateClaim from "./formatDateClaim";

export default function addDeathDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[WD_DATE_OF_DEATH];
  if (claim) entity.deathDate = formatDateClaim(claim, languageCode);
  if (claim) entity.deathYear = formatDateClaim(claim, languageCode, true);
}
