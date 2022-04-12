import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addDescription(entity: Entity, languageCode: LangCode) {
  const { descriptions } = entity;
  if (!descriptions) return;
  const descriptionObject = descriptions[languageCode];

  if (!descriptionObject) return;

  if (descriptionObject.value.startsWith("Peerage person ID=")) return;

  // remove dates/years from description
  entity.description = descriptionObject.value.replace(
    /\((.*)\d{4}(.*)\)/g,
    "",
  );
}
