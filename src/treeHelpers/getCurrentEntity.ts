import { Entity, EntityProp } from "types/Entity";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { FAMILY_TREE_TRANSLATIONS } from "constants/langs";
import { LangCode } from "types/Lang";
import { WikibaseAlias } from "wikibase/getWikibaseInstance";
import { getRootEntity } from "treeHelpers/getEntities";
import getWikibaseConstants from "wikibase/getWikibaseConstants";
import getWikibaseEntityProps from "wikibase/getWikibaseEntityProps";

export const getCurrentEntity = async ({
  entityId,
  wikibaseAlias,
  langCode,
  propSlug,
}: {
  entityId: string;
  wikibaseAlias: WikibaseAlias;
  langCode: LangCode;
  propSlug?: string;
}): Promise<{
  currentEntity: Entity;
  currentProp?: EntityProp;
  currentEntityProps?: EntityProp[];
}> => {
  const { CHILD_ID, FAMILY_IDS_MAP, FAMILY_TREE_PROP } =
    getWikibaseConstants(wikibaseAlias);

  let currentEntityProps = await getWikibaseEntityProps(
    entityId,
    langCode,
    wikibaseAlias,
  );

  let currentProp;
  if (propSlug && propSlug !== DEFAULT_PROPERTY_ALL) {
    currentProp = currentEntityProps.find(({ slug }) => slug === propSlug);
    //not found, try by id
    if (!currentProp) {
      currentProp = currentEntityProps.find(({ id }) => id === propSlug);
    }
  }

  //still no currentProp, redirect to family tree if possible
  if (
    !currentProp &&
    currentEntityProps.some((prop) => FAMILY_IDS_MAP[prop.id])
  ) {
    const familyTreeProp = { ...FAMILY_TREE_PROP };
    //Remove all family-related props in favour of the custom
    currentEntityProps = currentEntityProps.filter((prop) => {
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
    currentEntityProps = [familyTreeProp, ...currentEntityProps];

    //Select the family tree if no other currentProp is selected, or if it's a family currentProp
    if (!currentProp || FAMILY_IDS_MAP[currentProp.id]) {
      currentProp = familyTreeProp;
    }
  }

  const currentEntity = await getRootEntity(entityId, langCode, {
    wikibaseAlias,
    currentPropId: currentProp?.id,
    addSourceIds: true,
    addTargetIds: true,
    addNextBeforeIds: currentProp?.id === CHILD_ID,
    addNextAfterIds: currentProp?.id === CHILD_ID,
  });

  return { currentEntity, currentProp, currentEntityProps };
};
