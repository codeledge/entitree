import { Entity } from "types/Entity";
import { WD_PLACE_OF_BIRTH } from "@entitree/helper";
import { getBestClaimValueId } from "./getBestClaim";

export default function addBirthPlaceId(entity: Entity) {
  const claim = entity.claims?.[WD_PLACE_OF_BIRTH];

  if (claim) entity.birthPlaceId = getBestClaimValueId(claim);
}
