import { EYE_AND_HAIR_COLORS } from "constants/eyeHairColors";
import { EYE_COLOR_ID } from "constants/properties";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addEyeColor(entity: Entity) {
  const eyeColorId = getSimpleClaimValue(entity.simpleClaims, EYE_COLOR_ID);

  const color = EYE_AND_HAIR_COLORS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + eyeColorId,
  );

  if (color) {
    entity.eyeColor = color;
  }
}
