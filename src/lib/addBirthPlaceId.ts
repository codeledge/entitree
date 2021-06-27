import { BIRTH_PLACE_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { getBestClaimValueId } from "./getBestClaim";

export default function addBirthPlaceId(entity: Entity) {
  const claim = entity.claims?.[BIRTH_PLACE_ID];

  if (claim) entity.birthPlaceId = getBestClaimValueId(claim);
}
