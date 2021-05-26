import { DISSOLVED_ABOLISHED_DEMOLISHED_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import formatDateClaim from "./formatDateClaim";

export default function addAbolishedDate(
  entity: Entity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[DISSOLVED_ABOLISHED_DEMOLISHED_ID];
  if (claim) entity.abolishedDate = formatDateClaim(claim, languageCode);
}
