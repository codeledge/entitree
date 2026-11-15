import * as FACTGRID_PROPERTIES from "constants/factgrid/properties";

import { DataSource, WD_FATHER, WD_MOTHER } from "@entitree/helper";
import { Entity, EntityProp } from "types/Entity";
import {
  WikibaseEntitiesMap,
  buildEntities,
  fetchWikibaseEntitiesMap,
  getRootEntity,
} from "treeHelpers/getEntities";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import { FAMILY_TREE_PROP_TRANSLATIONS } from "constants/langs";
import { LangCode } from "types/Lang";
import getWikibaseConstants from "wikibase/getWikibaseConstants";
import getWikibaseEntityProps from "wikibase/getWikibaseEntityProps";
import hasIncomingClaim from "wikibase/hasIncomingClaim";

// The custom "family tree" prop (child prop, with parents/spouses/siblings)
export const getFamilyTreeProp = (
  dataSource: DataSource,
  langCode: LangCode,
  childLabel?: string,
): EntityProp => {
  const { FAMILY_TREE_PROP } = getWikibaseConstants(dataSource);
  const familyTreeProp: EntityProp = { ...FAMILY_TREE_PROP };

  if (childLabel) familyTreeProp.label = childLabel; //translated child label

  //check if there is a translation for it
  const translatedFamilyTree = FAMILY_TREE_PROP_TRANSLATIONS[langCode];
  if (translatedFamilyTree) {
    familyTreeProp.overrideLabel = translatedFamilyTree;
    familyTreeProp.slug = translatedFamilyTree.replace(/\s/g, "_");
  }

  return familyTreeProp;
};

// The props dropdown: all family-related props are replaced by the "family tree" one
export const buildEntityProps = (
  rawProps: EntityProp[],
  langCode: LangCode,
  dataSource: DataSource,
): { entityProps: EntityProp[]; familyTreeProp?: EntityProp } => {
  const { WD_CHILD, FAMILY_IDS_MAP } = getWikibaseConstants(dataSource);

  if (!rawProps.some((prop) => FAMILY_IDS_MAP[prop.id]))
    return { entityProps: rawProps };

  const familyTreeProp = getFamilyTreeProp(
    dataSource,
    langCode,
    rawProps.find((prop) => prop.id === WD_CHILD)?.label,
  );

  return {
    entityProps: [
      familyTreeProp,
      ...rawProps.filter((prop) => !FAMILY_IDS_MAP[prop.id]),
    ],
    familyTreeProp,
  };
};

const getParentPropIds = (dataSource: DataSource) =>
  dataSource === "factgrid"
    ? [FACTGRID_PROPERTIES.FATHER_ID, FACTGRID_PROPERTIES.MOTHER_ID]
    : [WD_FATHER, WD_MOTHER];

// Same rule as the props query: a family tree needs children or parents
const hasFamily = async (
  entityId: string,
  wikibaseEntitiesMap: WikibaseEntitiesMap,
  dataSource: DataSource,
) => {
  const { WD_CHILD } = getWikibaseConstants(dataSource);
  const claims = wikibaseEntitiesMap[entityId]?.claims || {};

  if ([WD_CHILD, ...getParentPropIds(dataSource)].some((p) => claims[p]?.length))
    return true;

  // nobody listed as child or parent, maybe a parent lists this item as child
  return hasIncomingClaim(entityId, WD_CHILD, dataSource);
};

const buildRootEntity = async (
  entityId: string,
  wikibaseEntitiesMap: WikibaseEntitiesMap,
  langCode: LangCode,
  dataSource: DataSource,
  currentProp?: EntityProp,
) => {
  const { WD_CHILD } = getWikibaseConstants(dataSource);

  const [root] = await buildEntities(
    [entityId],
    wikibaseEntitiesMap,
    langCode,
    {
      dataSource,
      currentPropId: currentProp?.id,
      addSourceIds: true,
      addTargetIds: true,
      addNextBeforeIds: currentProp?.id === WD_CHILD,
      addNextAfterIds: currentProp?.id === WD_CHILD,
    },
  );

  if (root) root.treeId = "0";

  return root;
};

/**
 * Root entity and selected prop of a tree page.
 * Family tree (and "all") pages are decided from the root's own claims, so the slow
 * props SPARQL query only runs when the url asks for a specific prop.
 * Without currentEntityProps the client loads the dropdown list after rendering.
 */
export const getCurrentEntity = async ({
  entityId,
  dataSource,
  langCode,
  propSlug,
}: {
  entityId: string;
  dataSource: DataSource;
  langCode: LangCode;
  propSlug?: string;
}): Promise<{
  currentEntity: Entity;
  currentProp?: EntityProp;
  currentEntityProps?: EntityProp[];
}> => {
  if (dataSource === "geni") {
    const currentEntity = await getRootEntity(entityId, langCode, {
      dataSource,
      addSourceIds: true,
      addTargetIds: true,
    });

    return { currentEntity };
  }

  const { FAMILY_TREE_PROP } = getWikibaseConstants(dataSource);
  const translatedFamilyTreeProp = getFamilyTreeProp(dataSource, langCode);

  const isFamilyTreeOrAll =
    !propSlug ||
    propSlug === DEFAULT_PROPERTY_ALL ||
    propSlug === FAMILY_TREE_PROP.slug ||
    propSlug === translatedFamilyTreeProp.slug;

  if (isFamilyTreeOrAll) {
    const wikibaseEntitiesMap = await fetchWikibaseEntitiesMap(
      [entityId],
      langCode,
      { dataSource },
    );

    const currentProp = (await hasFamily(
      entityId,
      wikibaseEntitiesMap,
      dataSource,
    ))
      ? translatedFamilyTreeProp
      : undefined;

    const currentEntity = await buildRootEntity(
      entityId,
      wikibaseEntitiesMap,
      langCode,
      dataSource,
      currentProp,
    );

    return { currentEntity, currentProp };
  }

  // a specific prop: the props list is needed to find it by slug
  const [rawProps, wikibaseEntitiesMap] = await Promise.all([
    getWikibaseEntityProps(entityId, langCode, dataSource),
    fetchWikibaseEntitiesMap([entityId], langCode, { dataSource }),
  ]);

  const { entityProps, familyTreeProp } = buildEntityProps(
    rawProps,
    langCode,
    dataSource,
  );

  //find by slug, or else by id
  let currentProp =
    rawProps.find(({ slug }) => slug === propSlug) ||
    rawProps.find(({ id }) => id === propSlug);

  //still no currentProp, use the family tree if possible
  if (!currentProp && familyTreeProp) currentProp = familyTreeProp;

  const currentEntity = await buildRootEntity(
    entityId,
    wikibaseEntitiesMap,
    langCode,
    dataSource,
    currentProp,
  );

  return { currentEntity, currentProp, currentEntityProps: entityProps };
};
