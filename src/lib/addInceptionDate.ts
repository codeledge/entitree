import { BigEntity } from "types/Entity";
import { INCEPTION_ID } from "../constants/properties";
import { LangCode } from "types/Lang";
import formatDateClaim from "./formatDateClaim";

export default function addInceptionDate(
  entity: BigEntity,
  languageCode: LangCode,
) {
  const claim = entity.claims?.[INCEPTION_ID];
  if (claim) entity.inceptionDate = formatDateClaim(claim, languageCode);
}
