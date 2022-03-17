import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import { WD_DISSOLVED_ABOLISHED_OR_DEMOLISHED_DATE } from "@entitree/wikidata-helper";
import formatDateClaim from "./formatDateClaim";

export default function addAbolishedDate(
  entity: Entity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[WD_DISSOLVED_ABOLISHED_OR_DEMOLISHED_DATE];
  if (claim) entity.abolishedDate = formatDateClaim(claim, languageCode);
}
