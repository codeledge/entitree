import {
  CHILD_ID,
  DEFAULT_PROPERTY_ALL,
  FAMILY_IDS_MAP,
  FAMILY_TREE_PROP,
  FAMILY_TREE_TRANSLATIONS,
} from "constants/properties";
import { Entity, EntityProp } from "types/Entity";

import { LangCode } from "types/Lang";
import getItemProps from "wikidata/getItemProps";
import { getRootEntity } from "lib/getEntities";

export const loadEntity = async ({
  itemId,
  langCode,
  propSlug,
}: {
  itemId: string;
  langCode: LangCode;
  propSlug?: string;
}): Promise<{
  currentEntity: Entity;
  currentProp?: EntityProp;
  itemProps?: EntityProp[];
}> => {
  let itemProps = await getItemProps(itemId, langCode);

  let currentProp;
  if (propSlug && propSlug !== DEFAULT_PROPERTY_ALL) {
    currentProp = itemProps.find(({ slug }) => slug === propSlug);
    //not found, try by id
    if (!currentProp) {
      currentProp = itemProps.find(({ id }) => id === propSlug);
    }
  }

  //still no currentProp, redirect to family tree if possible
  if (!currentProp && itemProps.some((prop) => FAMILY_IDS_MAP[prop.id])) {
    const familyTreeProp = { ...FAMILY_TREE_PROP };
    //Remove all family-related props in favour of the custom
    itemProps = itemProps.filter((prop) => {
      if (prop.id === CHILD_ID) familyTreeProp.label = prop.label; //get translated child label
      return !FAMILY_IDS_MAP[prop.id];
    });

    //check if there is a translation for it
    const translatedFamilyTree = FAMILY_TREE_TRANSLATIONS[langCode];
    if (translatedFamilyTree) {
      familyTreeProp.overrideLabel = translatedFamilyTree;
      familyTreeProp.slug = translatedFamilyTree.replace(/\s/g, "_");
    }

    //Add the Family tree fav currentProp
    itemProps = [familyTreeProp, ...itemProps];

    //Select the family tree if no other currentProp is selected, or if it's a family currentProp
    if (!currentProp || FAMILY_IDS_MAP[currentProp.id]) {
      currentProp = familyTreeProp;
    }
  }

  const currentEntity = await getRootEntity(itemId, langCode, {
    currentPropId: currentProp?.id,
    addUpIds: true,
    addDownIds: true,
    addLeftIds: currentProp?.id === CHILD_ID,
    addRightIds: currentProp?.id === CHILD_ID,
  });

  return { currentEntity, currentProp, itemProps };
};
