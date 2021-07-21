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
  dispatch(setLoadingChildren({ entityNode }));

  if (entityNode.childrenTreeIds) {
    dispatch(collapseChildren({ entityNode }));
    removeUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);
  } else if (entityNode._childrenTreeIds) {
    //has cached data
    dispatch(
      expandChildren({
        entityNode,
      }),
    );
    addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const children = await getChildEntities(
        entityNode.downIds!,
        languageCode,
        {
          currentPropId: currentProp?.id,
          addDownIds: true,
          addRightIds: currentProp?.id === CHILD_ID,
          downIdsAlreadySorted: entityNode.downIdsAlreadySorted,
        },
      );

      //todo: move this in get Entities
      children.forEach((child, index) => {
        child.treeId = `${entityNode.treeId}${CHILD_BOOKMARK_SYMBOL}${index}`;
      });

      addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);

      dispatch(expandChildren({ entityNode, children, options }));
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleParents = (
  entityNode: EntityNode,
  options?: ToggleOptions,
): AppThunk => async (dispatch, getState) => {
  dispatch(setLoadingParents({ entityNode }));

  if (entityNode.parentsTreeIds) {
    dispatch(collapseParents({ entityNode }));
    removeUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
  } else if (entityNode._parentsTreeIds) {
    //has cached data
    dispatch(
      expandParents({
        entityNode,
      }),
    );
    addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const parents = await getParentEntities(entityNode.upIds!, languageCode, {
        currentPropId: currentProp?.id,
        addUpIds: true,
        addLeftIds: currentProp?.id === CHILD_ID,
      });

      //todo: move this in get Entities
      parents.forEach((child, index) => {
        child.treeId = `${entityNode.treeId}${PARENT_BOOKMARK_SYMBOL}${index}`;
      });

      dispatch(expandParents({ entityNode, parents, options }));

      addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
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
    addUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;

      const siblings = await getSiblingEntities(
        entityNode.leftIds!,
        languageCode,
        {},
      );

      //todo: move this in get Entities
      siblings.forEach((child, index) => {
        child.treeId = `${entityNode.treeId}${SIBLING_BOOKMARK_SYMBOL}${index}`;
      });

      dispatch(
        expandSiblings({
          entityNode,
          siblings,
          options,
        }),
      );

      addUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
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
    addUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const spouses = await getSpouseEntities(
        entityNode.rightIds!,
        languageCode,
        {
          currentPropId: currentProp?.id,
        },
      );

      //todo: move this in get Entities
      spouses.forEach((child, index) => {
        child.treeId = `${entityNode.treeId}${SPOUSE_BOOKMARK_SYMBOL}${index}`;
      });

      dispatch(
        expandSpouses({
          entityNode,
          spouses,
          options,
        }),
      );

      addUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
    } catch (error) {
      console.error(error);
    }
  }
};
