import {
  CHILD_ID,
  DEFAULT_PROPERTY_ALL,
  FAMILY_IDS_MAP,
  FAMILY_TREE_PROP,
  FAMILY_TREE_TRANSLATIONS,
} from "constants/properties";
import { Entity, EntityProp } from "types/Entity";
import {
  getChildEntities,
  getParentEntities,
  getRootEntity,
} from "lib/getEntities";
import {
  reset,
  setChildTree,
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setCurrentUpMap,
  setParentTree,
} from "store/treeSlice";

import { AnyAction } from "redux";
import { Dispatch } from "react";
import { LangCode } from "types/Lang";
import getItemProps from "wikidata/getItemProps";
import getUpMap from "wikidata/getUpMap";

export const loadEntity = async ({
  itemId,
  langCode,
  propSlug,
  dispatch,
}: {
  itemId: string;
  langCode: LangCode;
  propSlug?: string;
  dispatch: Dispatch<AnyAction>;
}): Promise<{ currentEntity: Entity; currentProp?: EntityProp }> => {
  dispatch(reset());
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

  const upMap = currentProp && (await getUpMap(itemId, currentProp.id));
  const currentEntity = await getRootEntity(itemId, langCode, {
    currentPropId: currentProp?.id,
    upMap,
    addDownIds: true,
    addLeftIds: true,
    addRightIds: true,
  });

  const [preloadedChildren, preloadedParents] = await Promise.all([
    currentEntity.downIds &&
      getChildEntities(currentEntity.downIds!, langCode, {
        currentPropId: currentProp?.id,
        addDownIds: true,
        addRightIds: currentProp?.id === CHILD_ID,
        downIdsAlreadySorted: currentEntity.downIdsAlreadySorted,
      }),
    upMap &&
      getParentEntities(upMap[currentEntity.id], langCode, {
        currentPropId: currentProp?.id,
        upMap,
        addLeftIds: currentProp?.id === CHILD_ID,
      }),
  ]);

  if (preloadedChildren)
    dispatch(
      setChildTree({
        ...currentEntity,
        children: preloadedChildren,
      }),
    );
  if (preloadedParents)
    dispatch(
      setParentTree({
        ...currentEntity,
        parents: preloadedParents,
      }),
    );

  dispatch(setCurrentEntityProps(itemProps));
  if (upMap) dispatch(setCurrentUpMap(upMap));
  if (currentProp) dispatch(setCurrentProp(currentProp));
  dispatch(setCurrentEntity(currentEntity));

  return { currentEntity, currentProp };
};
