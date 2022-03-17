import { EYE_AND_HAIR_COLORS, WD_HAIR_COLOR } from "@entitree/wikidata-helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addHairColor(entity: Entity) {
  const hairColorId = getSimpleClaimValue(entity.simpleClaims, WD_HAIR_COLOR);

  const color = EYE_AND_HAIR_COLORS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + hairColorId,
  );

  if (color) {
    entity.hairColor = color;
  }
}
