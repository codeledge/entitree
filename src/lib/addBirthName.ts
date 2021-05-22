import { BIRTH_NAME_ID } from "../constants/properties";
import { BigEntity } from "types/Entity";
import getBestClaim from "./getBestClaim";

export default function addBirthName(entity: BigEntity) {
  const claim = entity.claims?.[BIRTH_NAME_ID];

  if (claim) entity.birthName = getBestClaim(claim, "text");
}
