import { DEFAULT_PROPERTY_ALL } from "constants/properties";

export const getEntityUrl = (langCode, nextCurrentProp, nextCurrentEntity) => {
  return `/${langCode}/${
    (nextCurrentProp && encodeURIComponent(nextCurrentProp.slug)) ||
    DEFAULT_PROPERTY_ALL
  }/${nextCurrentEntity.wikipediaSlug || nextCurrentEntity.id}`;
};
