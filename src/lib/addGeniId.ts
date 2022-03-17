import { Entity } from "types/Entity";
import { WD_GENI_COM_PROFILE_ID } from "@entitree/wikidata-helper";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addGeniId(entity: Entity) {
  const geniId = getSimpleClaimValue(
    entity.simpleClaims,
    WD_GENI_COM_PROFILE_ID,
  );
  if (geniId) entity.geniId = geniId;
}
