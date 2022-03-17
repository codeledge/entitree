import { EYE_AND_HAIR_COLORS, WD_EYE_COLOR } from "@entitree/wikidata-helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addEyeColor(entity: Entity) {
  const eyeColorId = getSimpleClaimValue(entity.simpleClaims, WD_EYE_COLOR);
  const color = EYE_AND_HAIR_COLORS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + eyeColorId,
  );

  if (color) {
    entity.eyeColor = color;
  }
}
