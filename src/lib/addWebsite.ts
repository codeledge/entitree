import { Entity } from "types/Entity";
import { WD_OFFICIAL_WEBSITE } from "@entitree/wikidata-helper";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addWebsite(entity: Entity) {
  const website = getSimpleClaimValue(entity.simpleClaims, WD_OFFICIAL_WEBSITE);
  if (website) entity.website = website;
}
