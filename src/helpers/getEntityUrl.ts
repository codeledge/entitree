import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export const getEntityUrl = (
  langCode: LangCode,
  propSlug: string, //pass empty for "all"
  entity: Pick<Entity, "id" | "wikipediaSlug">,
) => {
  return `/${langCode}/${
    (propSlug && encodeURIComponent(propSlug)) || DEFAULT_PROPERTY_ALL
  }/${entity.wikipediaSlug || entity.id}`;
};
