import { Entity } from "types/Entity";
import { WD_BIRTH_NAME } from "@entitree/helper";
import { getBestClaimValueText } from "./getBestClaim";

export default function addBirthName(entity: Entity) {
  const claim = entity.claims?.[WD_BIRTH_NAME];

  if (claim) entity.birthName = getBestClaimValueText(claim);
}
