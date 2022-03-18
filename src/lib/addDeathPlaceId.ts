import { Entity } from "types/Entity";
import { WD_PLACE_OF_DEATH } from "@entitree/helper";
import { getBestClaimValueId } from "./getBestClaim";

export default function addDeathPlaceId(entity: Entity) {
  const claim = entity.claims?.[WD_PLACE_OF_DEATH];

  if (claim) entity.deathPlaceId = getBestClaimValueId(claim);
}
