import { Entity, EntityProp } from "types/Entity";

import { SITE_NAME } from "constants/meta";
import pluralize from "pluralize";

export const createMetaTags = (
  langCode: string,
  currentEntity: Entity,
  currentProp: EntityProp,
) => {
  let ogDescription: string;
  let ogTitle: string;

  if (langCode === "hi" && currentProp?.id === "P40") {
    ogDescription = `${currentEntity.label} के वंश वृक्ष की खोज करें`;

    ogTitle = `${currentEntity.label} - ${
      currentProp.overrideLabel || currentProp.label
    }  - ${SITE_NAME}`;
  } else if (langCode === "es" && currentProp?.id === "P40") {
    ogDescription = `Descubre el árbol genealógico de ${currentEntity.label}`;

    ogTitle = `${currentEntity.label} - ${
      currentProp.overrideLabel || currentProp.label
    }  - ${SITE_NAME}`;
  } else {
    //Example: Discover the family tree of Elizabeth II: queen of the UK, Canada, Australia, and New Zealand, and head of the Commonwealth of Nations, 4 children, 1 sibling, 1 spouse
    ogDescription = `${
      currentProp
        ? `Discover the ${
            currentProp?.overrideLabel || currentProp?.label
          } of ${currentEntity.label}: `
        : ""
    }${currentEntity?.description}${
      currentEntity.downIds?.length
        ? `, ${pluralize("child", currentEntity.downIds.length, true)}`
        : ""
    }${
      currentEntity.leftIds?.length
        ? `, ${pluralize("sibling", currentEntity.leftIds.length, true)}`
        : ""
    }${
      currentEntity.spousesIds?.length
        ? `, ${pluralize("spouse", currentEntity.spousesIds.length, true)}`
        : ""
    }${
      currentEntity.partnersIds?.length
        ? `, ${pluralize("partner", currentEntity.partnersIds.length, true)}`
        : ""
    }`;

    ogTitle = `${currentEntity.label}${
      currentProp ? ` - ${currentProp.overrideLabel || currentProp.label}` : ""
    } - ${SITE_NAME}`;
  }

  return {
    ogDescription,
    ogTitle,
  };
};
