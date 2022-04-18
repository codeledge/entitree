import { Entity, EntityProp } from "types/Entity";

import { LangCode } from "types/Lang";
import { SITE_NAME } from "constants/meta";
import { WD_CHILD } from "constants/properties";
import pluralize from "pluralize";

export const createMetaTags = (
  langCode: LangCode,
  currentEntity: Entity,
  currentProp?: EntityProp,
) => {
  const ogTitle = `${currentEntity.label}${
    currentProp ? ` - ${currentProp.overrideLabel || currentProp.label}` : ""
  } - ${SITE_NAME}`;

  let ogDescription: string;
  if (langCode === "hi" && currentProp?.id === WD_CHILD) {
    ogDescription = `${currentEntity.label} के वंश वृक्ष की खोज करें`;
  } else if (langCode === "es" && currentProp?.id === WD_CHILD) {
    ogDescription = `Descubre el árbol genealógico de ${currentEntity.label}`;
  } else {
    //Example: Discover the family tree of Elizabeth II: queen of the UK, Canada, Australia, and New Zealand, and head of the Commonwealth of Nations, 4 children, 1 sibling, 1 spouse
    ogDescription = `${
      currentProp
        ? `Discover the ${
            currentProp?.overrideLabel || currentProp?.label
          } of ${currentEntity.label}: `
        : ""
    }${currentEntity?.description}`;

    if (currentProp?.id === WD_CHILD) {
      ogDescription += `
      ${
        currentEntity.targetIds?.length
          ? `, ${pluralize("child", currentEntity.targetIds.length, true)}`
          : ""
      }${
        currentEntity.nextBeforeIds?.length
          ? `, ${pluralize(
              "sibling",
              currentEntity.nextBeforeIds.length,
              true,
            )}`
          : ""
      }${
        currentEntity.spousesIds?.length
          ? `, ${pluralize("spouse", currentEntity.spousesIds.length, true)}`
          : ""
      }${
        currentEntity.partnersIds?.length
          ? `, ${pluralize("partner", currentEntity.partnersIds.length, true)}`
          : ""
      }
      `;
    }
  }

  return {
    ogDescription,
    ogTitle,
  };
};
