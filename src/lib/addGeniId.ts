import { Entity } from "types/Entity";
import { GENI_ID } from "constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addGeniId(entity: Entity) {
  const geniId = getSimpleClaimValue(entity.simpleClaims, GENI_ID);
  if (geniId) entity.geniId = geniId;
}
