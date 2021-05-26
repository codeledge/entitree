import { DEFAULT_LANGS_CODES } from "../constants/langs";
/* eslint-disable no-restricted-syntax */
import { Entity } from "types/Entity";

export default function addLabel(entity: Entity, languageCode) {
  const { labels } = entity;
  if (!labels) return;

  let labelObject = labels[languageCode];
  if (!labelObject)
    for (const defaultLangCode of DEFAULT_LANGS_CODES) {
      const defaultLangLabel = labels[defaultLangCode];
      if (defaultLangLabel) {
        labelObject = defaultLangLabel;
        break;
      }
    }

  if (!labelObject) return;

  entity.label = labelObject.value;
}
