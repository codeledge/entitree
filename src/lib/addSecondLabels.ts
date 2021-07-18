import { NAME_IN_KANA_ID, NICKNAME_ID } from "../constants/properties";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabels(entity: Entity) {
  const { simpleClaims } = entity;

  const nickName = getSimpleClaimValue(simpleClaims, NICKNAME_ID);
  if (nickName) {
    entity.nickName = nickName;
  }
  const nameInKana = getSimpleClaimValue(simpleClaims, NAME_IN_KANA_ID);
  if (nameInKana) {
    entity.nameInKana = nameInKana;
  }
}
