import { RELIGIONS, WD_RELIGION_OR_WORLDVIEW } from "@entitree/helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addReligion(entity: Entity) {
  const religionId = getSimpleClaimValue(
    entity.simpleClaims,
    WD_RELIGION_OR_WORLDVIEW,
  );

  const religion = RELIGIONS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + religionId,
  );

  if (religion) {
    entity.religion = religion;
  }
}
