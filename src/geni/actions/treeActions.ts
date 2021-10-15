import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import { CHILD_ID, PARTNER_ID, SPOUSE_ID } from "constants/properties";
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
} from "../lib/getEntities";

import { AppThunk } from "store";
import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import { ToggleOptions } from "../../types/ToggleOptions";
import { addUrlBookmark } from "treeHelpers/addUrlBookmark";
import { removeUrlBookmark } from "treeHelpers/removeUrlBookmark";

export const toggleChildren =
  (entityNode: EntityNode, options?: ToggleOptions): AppThunk =>
  async (dispatch, getState) => {
    function collapseRecursive(entity?: Entity) {
      if (!entity || !entity.openChildTreeIds) return;
      dispatch(collapseChildren({ entity }));
      removeUrlBookmark(entity.treeId!, CHILD_BOOKMARK_SYMBOL);
      entity.openChildTreeIds.forEach((treeId) => {
        collapseRecursive(getState().tree.entitiesMap?.[treeId]);
      });
    }

    dispatch(setLoadingChildren({ entityNode }));

    if (entityNode.openChildTreeIds) {
      collapseRecursive(entityNode);
    } else if (entityNode.closedChildTreeIds) {
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
        const { languageCode, wikibaseAlias, geni } = getState().settings;
        // const { currentProp } = getState().tree;
        const currentProp = { id: CHILD_ID };

        const children = await getChildEntities(entityNode, languageCode, {
          wikibaseAlias,
          currentPropId: currentProp?.id,
          addDownIds: true,
          addRightIds: currentProp?.id === CHILD_ID,
          downIdsAlreadySorted: entityNode.downIdsAlreadySorted,
          geniAccessToken: geni.access_token,
        });

        dispatch(expandChildren({ entityNode, children, options }));

        if (!entityNode.isRoot)
          addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);
      } catch (error) {
        console.error(error);
      }
    }
  };

export const preloadChildren =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    if (
      entityNode.closedChildTreeIds ||
      entityNode.openChildTreeIds ||
      !entityNode.downIds
    )
      return;

    const { languageCode, wikibaseAlias, geni } = getState().settings;
    // const { currentProp } = getState().tree;
    const currentProp = { id: CHILD_ID };

    const children = await getChildEntities(entityNode, languageCode, {
      wikibaseAlias,
      currentPropId: currentProp?.id,
      addDownIds: true,
      addRightIds: currentProp?.id === CHILD_ID,
      downIdsAlreadySorted: entityNode.downIdsAlreadySorted,
      geniAccessToken: geni.access_token,
    });

    dispatch(setPreloadedChildren({ entityNode, children }));
  };

export const toggleParents =
  (entityNode: EntityNode, options?: ToggleOptions): AppThunk =>
  async (dispatch, getState) => {
    function collapseRecursive(entity?: Entity) {
      if (!entity || !entity.openParentTreeIds) return;
      dispatch(collapseParents({ entity }));
      removeUrlBookmark(entity.treeId!, PARENT_BOOKMARK_SYMBOL);
      entity.openParentTreeIds.forEach((parentTreeId) => {
        collapseRecursive(getState().tree.entitiesMap?.[parentTreeId]);
      });
    }

    dispatch(setLoadingParents({ entityNode }));

    if (entityNode.openParentTreeIds) {
      collapseRecursive(entityNode);
    } else if (entityNode.closedParentTreeIds) {
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
        const { languageCode, wikibaseAlias, geni } = getState().settings;
        // const { currentProp } = getState().tree;
        const currentProp = { id: CHILD_ID };
        const parents = await getParentEntities(entityNode, languageCode, {
          wikibaseAlias,
          currentPropId: currentProp?.id,
          addUpIds: true,
          addLeftIds: currentProp?.id === CHILD_ID,
          geniAccessToken: geni.access_token,
        });

        dispatch(expandParents({ entityNode, parents, options }));

        if (!entityNode.isRoot)
          addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
      } catch (error) {
        console.error(error);
      }
    }
  };

export const preloadParents =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedParentTreeIds ||
      entityNode.openParentTreeIds ||
      !entityNode.upIds
    )
      return;
    const { languageCode, wikibaseAlias, geni } = getState().settings;
    // const { currentProp } = getState().tree;
    const currentProp = { id: CHILD_ID };

    const parents = await getParentEntities(entityNode, languageCode, {
      wikibaseAlias,
      currentPropId: currentProp?.id,
      addUpIds: true,
      addLeftIds: currentProp?.id === CHILD_ID,
      geniAccessToken: geni.access_token,
    });

    dispatch(setPreloadedParents({ entityNode, parents }));
  };

export const toggleSiblings =
  (entityNode: EntityNode, options?: ToggleOptions): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoadingSiblings({ entityNode }));

    if (entityNode.openSiblingTreeIds) {
      dispatch(collapseSiblings({ entityNode }));
      removeUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
    } else if (entityNode.closedSiblingTreeIds) {
      dispatch(
        expandSiblings({
          entityNode,
        }),
      );
      if (!entityNode.isRoot)
        addUrlBookmark(entityNode.treeId!, SIBLING_BOOKMARK_SYMBOL);
    } else {
      try {
        const { languageCode, wikibaseAlias, geni } = getState().settings;

        const siblings = await getSiblingEntities(entityNode, languageCode, {
          wikibaseAlias,
          geniAccessToken: geni.access_token,
        });

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

export const preloadSiblings =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedSiblingTreeIds ||
      entityNode.openSiblingTreeIds ||
      !entityNode.leftIds
    )
      return;

    const { languageCode, wikibaseAlias, geni } = getState().settings;
    const siblings = await getSiblingEntities(entityNode, languageCode, {
      wikibaseAlias,
      geniAccessToken: geni.access_token,
    });

    dispatch(setPreloadedSiblings({ entityNode, siblings }));
  };

export const toggleSpouses =
  (entityNode: EntityNode, options?: ToggleOptions): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoadingSpouses({ entityNode }));

    if (entityNode.openSpouseTreeIds) {
      dispatch(collapseSpouses({ entityNode }));
      removeUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
    } else if (entityNode.closedSpouseTreeIds) {
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
        const { languageCode, rightEntityOption, wikibaseAlias, geni } =
          getState().settings;

        const spouses = await getSpouseEntities(entityNode, languageCode, {
          wikibaseAlias,
          geniAccessToken: geni.access_token,
        });

        const filteredRightEntities = spouses?.filter((spouse) => {
          return true;
          if (
            rightEntityOption.propIds.indexOf(SPOUSE_ID) > -1 &&
            entityNode.spousesIds?.includes(spouse.id)
          )
            return true;
          if (
            rightEntityOption.propIds.indexOf(PARTNER_ID) > -1 &&
            entityNode.partnersIds?.includes(spouse.id)
          )
            return true;

          return false;
        });

        dispatch(
          expandSpouses({
            entityNode,
            spouses: filteredRightEntities,
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

export const preloadSpouses =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedSpouseTreeIds ||
      entityNode.openSpouseTreeIds ||
      !entityNode.rightIds
    )
      return;

    const { languageCode, wikibaseAlias, geni } = getState().settings;
    const spouses = await getSpouseEntities(entityNode, languageCode, {
      wikibaseAlias,
      geniAccessToken: geni.access_token,
    });

    dispatch(setPreloadedSpouses({ entityNode, spouses }));
  };
