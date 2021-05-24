import {
  BIRTH_NAME_ID,
  NAME_IN_KANA_ID,
  NICKNAME_ID,
} from "../constants/properties";

import { BigEntity } from "types/Entity";
import { LangCode } from "types/Lang";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabel(
  entity: BigEntity,
  propCode: string | LangCode,
) {
  if (!propCode) return;
  const { labels, simpleClaims } = entity;

  //exeption for the following prop codes
  if ([BIRTH_NAME_ID, NICKNAME_ID, NAME_IN_KANA_ID].includes(propCode)) {
    const secondLabel = getSimpleClaimValue(simpleClaims, propCode);
    if (secondLabel) {
      entity.secondLabel = secondLabel;
    }
    return;
  }

  //try to add translated label
  const translatedLabel = labels?.[propCode]?.value;
  if (!translatedLabel) return;
  entity.secondLabel = translatedLabel;
}
