import { DEATH_PLACE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { getBestClaimValueId } from "./getBestClaim";

export default function addDeathPlaceId(entity: Entity) {
  const claim = entity.claims?.[DEATH_PLACE_ID];

  if (claim) entity.deathPlaceId = getBestClaimValueId(claim);
}
