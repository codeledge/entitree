import { WD_NAME_IN_KANA, WD_NICKNAME } from "@entitree/wikidata-helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabels(entity: Entity) {
  const { simpleClaims } = entity;

  const nickName = getSimpleClaimValue(simpleClaims, WD_NICKNAME);
  if (nickName) {
    entity.nickName = nickName;
  }
  const nameInKana = getSimpleClaimValue(simpleClaims, WD_NAME_IN_KANA);
  if (nameInKana) {
    entity.nameInKana = nameInKana;
  }
}
