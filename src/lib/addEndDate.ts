import { BigEntity } from "types/Entity";
import { END_DATE_ID } from "../constants/properties";
import { Lang } from "../types/Lang";
import formatDateClaim from "./formatDateClaim";

export default function addEndDate(
  entity: BigEntity,
  languageCode: Lang["code"],
) {
  const claim = entity.claims?.[END_DATE_ID];
  if (claim) entity.endDate = formatDateClaim(claim, languageCode);
}
