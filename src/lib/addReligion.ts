import { Entity } from "types/Entity";
import { RELIGIONS } from "constants/religions";
import { RELIGION_ID } from "constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addReligion(entity: Entity) {
  const religionId = getSimpleClaimValue(entity.simpleClaims, RELIGION_ID);

  const religion = RELIGIONS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + religionId,
  );

  if (religion) {
    entity.religion = religion;
  }
}
