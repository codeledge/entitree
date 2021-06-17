import { EYE_AND_HAIR_COLORS } from "constants/eyeHairColors";
import { Entity } from "types/Entity";
import { HAIR_COLOR_ID } from "constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addHairColor(entity: Entity) {
  const hairColorId = getSimpleClaimValue(entity.simpleClaims, HAIR_COLOR_ID);

  const color = EYE_AND_HAIR_COLORS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + hairColorId,
  );

  if (color) {
    entity.hairColor = color;
  }
}
