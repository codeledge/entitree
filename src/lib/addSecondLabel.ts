import {
  BIRTH_NAME_ID,
  NAME_IN_KANA_ID,
  NICKNAME_ID,
} from "../constants/properties";

import { BigEntity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabel(entity: BigEntity, propCode: string) {
  if (!propCode) return;
  const { labels, simpleClaims } = entity;
  if (!propCode) return;
  if ([BIRTH_NAME_ID, NICKNAME_ID, NAME_IN_KANA_ID].includes(propCode)) {
    const secondLabel = getSimpleClaimValue(simpleClaims, propCode);
    if (secondLabel) {
      entity.secondLabel = secondLabel;
    }
    return;
  }
  const labelObject = labels ? labels[propCode] : null;
  if (!labelObject) return;

  entity.secondLabel = labelObject.value;
}
