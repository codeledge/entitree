import { BIRTH_NAME_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { getBestClaimValueText } from "./getBestClaim";

export default function addBirthName(entity: Entity) {
  const claim = entity.claims?.[BIRTH_NAME_ID];

  if (claim) entity.birthName = getBestClaimValueText(claim);
}
