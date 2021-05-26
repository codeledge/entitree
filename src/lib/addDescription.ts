import { Entity } from "types/Entity";

export default function addDescription(entity: Entity, languageCode: string) {
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
