import { Entity } from "types/Entity";
import { WEBSITE_ID } from "constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addWebsite(entity: Entity) {
  const website = getSimpleClaimValue(entity.simpleClaims, WEBSITE_ID);
  if (website) entity.website = website;
}
