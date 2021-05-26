import { BIRTH_NAME_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import getBestClaim from "./getBestClaim";

export default function addBirthName(entity: Entity) {
  const claim = entity.claims?.[BIRTH_NAME_ID];

  if (claim) entity.birthName = getBestClaim(claim, "text");
}
