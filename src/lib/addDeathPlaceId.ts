import { BigEntity } from "types/Entity";
import { DEATH_PLACE_ID } from "../constants/properties";
import getBestClaim from "./getBestClaim";

export default function addDeathPlaceId(entity: BigEntity) {
  const claim = entity.claims?.[DEATH_PLACE_ID];

  if (claim) entity.deathPlaceId = getBestClaim(claim, "id");
}
