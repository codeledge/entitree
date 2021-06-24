import { END_DATE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";
import formatDateClaim from "./formatDateClaim";

export default function addEndDate(entity: Entity, languageCode: LangCode) {
  const claim = entity.claims?.[END_DATE_ID];
  if (claim) entity.endDate = formatDateClaim(claim, languageCode);
}
