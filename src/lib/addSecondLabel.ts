import {
  BIRTH_NAME_ID,
  NAME_IN_KANA_ID,
  NICKNAME_ID,
} from "../constants/properties";
import { Lang, SecondLabel } from "types/Lang";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabel(
  entity: Entity,
  secondLabel?: SecondLabel | Lang,
) {
  if (!secondLabel) return;
  const { labels, simpleClaims } = entity;

  //exeption for the following prop codes
  if (
    [BIRTH_NAME_ID, NICKNAME_ID, NAME_IN_KANA_ID].includes(secondLabel.code)
  ) {
    const secondLabelValue = getSimpleClaimValue(
      simpleClaims,
      secondLabel.code,
    );
    if (secondLabelValue) {
      entity.secondLabel = secondLabelValue;
    }
    return;
  }

  //try to add translated label
  const translatedLabel = labels?.[secondLabel.code]?.value;
  if (!translatedLabel) return;
  entity.secondLabel = translatedLabel;
}
