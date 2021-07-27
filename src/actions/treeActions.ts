import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import {
  collapseChildren,
  collapseParents,
  collapseSiblings,
  collapseSpouses,
  expandChildren,
  expandParents,
  expandSiblings,
  expandSpouses,
  setLoadingChildren,
  setLoadingParents,
  setLoadingSiblings,
  setLoadingSpouses,
  setPreloadedChildren,
  setPreloadedParents,
  setPreloadedSiblings,
  setPreloadedSpouses,
} from "store/treeSlice";
import {
  getChildEntities,
  getParentEntities,
  getSiblingEntities,
  getSpouseEntities,
} from "lib/getEntities";

import { AppThunk } from "store";
import { CHILD_ID } from "constants/properties";
import { EntityNode } from "types/EntityNode";
import { ToggleOptions } from "../types/ToggleOptions";
import { addUrlBookmark } from "treeHelpers/addUrlBookmark";
import { removeUrlBookmark } from "treeHelpers/removeUrlBookmark";

export const toggleChildren = (
  entityNode: EntityNode,
  options?: ToggleOptions,
): AppThunk => async (dispatch, getState) => {
  function collapseRecursive(node?: EntityNode) {
    if (!node || !node.childrenTreeIds) return;
    dispatch(collapseChildren({ entityNode: node }));
    removeUrlBookmark(node.treeId!, CHILD_BOOKMARK_SYMBOL);
    node.childrenTreeIds.forEach((treeId) => {
      collapseRecursive(getState().tree.entitiesMap?.[treeId]);
    });
  }

  dispatch(setLoadingChildren({ entityNode }));

  if (entityNode.childrenTreeIds) {
    collapseRecursive(entityNode);
  } else if (entityNode._childrenTreeIds) {
    //has cached data
    dispatch(
      expandChildren({
        entityNode,
      }),
    );
    if (!entityNode.isRoot)
      addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const children = await getChildEntities(entityNode, languageCode, {
        currentPropId: currentProp?.id,
        addDownIds: true,
        addRightIds: currentProp?.id === CHILD_ID,
        downIdsAlreadySorted: entityNode.downIdsAlreadySorted,
      });

      dispatch(expandChildren({ entityNode, children, options }));

      if (!entityNode.isRoot)
        addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
};

export const preloadChildren = (entityNode: EntityNode) => async (
  dispatch,
  getState,
) => {
  if (
    entityNode._childrenTreeIds ||
    entityNode.childrenTreeIds ||
    !entityNode.downIds
  )
    return;

  const { languageCode } = getState().settings;
  const { currentProp } = getState().tree;

  const children = await getChildEntities(entityNode, languageCode, {
    currentPropId: currentProp?.id,
    addDownIds: true,
    addRightIds: currentProp?.id === CHILD_ID,
    downIdsAlreadySorted: entityNode.downIdsAlreadySorted,
  });

  dispatch(setPreloadedChildren({ entityNode, children }));
};

export const toggleParents = (
  entityNode: EntityNode,
  options?: ToggleOptions,
): AppThunk => async (dispatch, getState) => {
  function collapseRecursive(node?: EntityNode) {
    if (!node || !node.parentsTreeIds) return;
    dispatch(collapseParents({ entityNode: node }));
    removeUrlBookmark(node.treeId!, PARENT_BOOKMARK_SYMBOL);
    node.parentsTreeIds.forEach((parentTreeId) => {
      collapseRecursive(getState().tree.entitiesMap?.[parentTreeId]);
    });
  }

  dispatch(setLoadingParents({ entityNode }));

  if (entityNode.parentsTreeIds) {
    collapseRecursive(entityNode);
  } else if (entityNode._parentsTreeIds) {
    //has cached data
    dispatch(
      expandParents({
        entityNode,
      }),
    );
    if (!entityNode.isRoot)
      addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const parents = await getParentEntities(entityNode, languageCode, {
        currentPropId: currentProp?.id,
        addUpIds: true,
        addLeftIds: currentProp?.id === CHILD_ID,
      });

      dispatch(expandParents({ entityNode, parents, options }));

      if (!entityNode.isRoot)
        addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
};

export const preloadParents = (entityNode: EntityNode) => async (
  dispatch,
  getState,
) => {
  // do not start preload if there are nodes loaded
  if (
    entityNode._parentsTreeIds ||
    entityNode.parentsTreeIds ||
    !entityNode.upIds
  )
    return;

  const { languageCode } = getState().settings;
  const { currentProp } = getState().tree;

  const parents = await getParentEntities(entityNode, languageCode, {
    currentPropId: currentProp?.id,
    addUpIds: true,
    addLeftIds: currentProp?.id === CHILD_ID,
  });

  dispatch(setPreloadedParents({ entityNode, parents }));
};

export const toggleSiblings = (
  entityNode: EntityNode,
  options?: ToggleOptions,
): AppThunk => async (dispatch, getState) => {
  dispatch(setLoadingSiblings({ entityNode }));

  if (entityNode.siblingsTreeIds) {
    dispatch(collapseSiblings({ entityNode }));
    removeUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
  } else if (entityNode._siblingsTreeIds) {
    dispatch(
      expandSiblings({
        entityNode,
      }),
    );
    if (!entityNode.isRoot)
      addUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;

      const siblings = await getSiblingEntities(entityNode, languageCode, {});

      dispatch(
        expandSiblings({
          entityNode,
          siblings,
          options,
        }),
      );

      if (!entityNode.isRoot)
        addUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
};

export const preloadSiblings = (entityNode: EntityNode) => async (
  dispatch,
  getState,
) => {
  // do not start preload if there are nodes loaded
  if (
    entityNode._siblingsTreeIds ||
    entityNode.siblingsTreeIds ||
    !entityNode.leftIds
  )
    return;

  const { languageCode } = getState().settings;
  const siblings = await getSiblingEntities(entityNode, languageCode, {});

  dispatch(setPreloadedSiblings({ entityNode, siblings }));
};

export const toggleSpouses = (
  entityNode: EntityNode,
  options?: ToggleOptions,
): AppThunk => async (dispatch, getState) => {
  dispatch(setLoadingSpouses({ entityNode }));

  if (entityNode.spousesTreeIds) {
    dispatch(collapseSpouses({ entityNode }));
    removeUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
  } else if (entityNode._spousesTreeIds) {
    //has cached data
    dispatch(
      expandSpouses({
        entityNode,
      }),
    );
    if (!entityNode.isRoot)
      addUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;

      const spouses = await getSpouseEntities(entityNode, languageCode, {});

      dispatch(
        expandSpouses({
          entityNode,
          spouses,
          options,
        }),
      );

      if (!entityNode.isRoot)
        addUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
};

export const preloadSpouses = (entityNode: EntityNode) => async (
  dispatch,
  getState,
) => {
  // do not start preload if there are nodes loaded
  if (
    entityNode._spousesTreeIds ||
    entityNode.spousesTreeIds ||
    !entityNode.rightIds
  )
    return;

  const { languageCode } = getState().settings;
  const spouses = await getSpouseEntities(entityNode, languageCode, {});

  dispatch(setPreloadedSpouses({ entityNode, spouses }));
};
