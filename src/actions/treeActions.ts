import ReactGA from "react-ga";
import { filterSpousePartnersIds } from "../filters/filterSpousePartnersIds";
import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import { CHILD_ID } from "constants/properties";
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
} from "treeHelpers/getEntities";

import { AppThunk } from "store";
import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import { ToggleOptions } from "../types/ToggleOptions";
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
        const start = performance.now();

        const { languageCode, dataSource } = getState().settings;
        const { currentProp } = getState().tree;

        const children = await getChildEntities(entityNode, languageCode, {
          dataSource,
          currentPropId: currentProp?.id,
          addTargetIds: true,
          addNextAfterIds: currentProp?.id === CHILD_ID,
          areTargetIdsSorted: entityNode.areTargetIdsSorted,
        });

        dispatch(expandChildren({ entityNode, children, options }));

        if (!entityNode.isRoot)
          addUrlBookmark(entityNode.treeId!, CHILD_BOOKMARK_SYMBOL);

        ReactGA.timing({
          category: "Async",
          variable: dataSource,
          value: performance.now() - start,
          label: "toggleChildren getChildEntities",
        });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoadingChildren({ entityNode, value: false }));
      }
    }
  };

export const preloadChildren =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    if (
      entityNode.closedChildTreeIds ||
      entityNode.openChildTreeIds ||
      !entityNode.targetIds
    )
      return;
    const start = performance.now();

    const { languageCode, dataSource } = getState().settings;
    const { currentProp } = getState().tree;

    const children = await getChildEntities(entityNode, languageCode, {
      dataSource,
      currentPropId: currentProp?.id,
      addTargetIds: true,
      addNextAfterIds: currentProp?.id === CHILD_ID,
      areTargetIdsSorted: entityNode.areTargetIdsSorted,
    });

    ReactGA.timing({
      category: "Async",
      variable: dataSource,
      value: performance.now() - start,
      label: "preloadChildren getChildEntities",
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
        const { languageCode, dataSource } = getState().settings;
        const { currentProp } = getState().tree;

        const parents = await getParentEntities(entityNode, languageCode, {
          dataSource,
          currentPropId: currentProp?.id,
          addSourceIds: true,
          addNextBeforeIds: currentProp?.id === CHILD_ID,
        });

        dispatch(expandParents({ entityNode, parents, options }));

        if (!entityNode.isRoot)
          addUrlBookmark(entityNode.treeId!, PARENT_BOOKMARK_SYMBOL);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoadingParents({ entityNode, value: false }));
      }
    }
  };

export const preloadParents =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedParentTreeIds ||
      entityNode.openParentTreeIds ||
      !entityNode.sourceIds
    )
      return;
    const { languageCode, dataSource } = getState().settings;
    const { currentProp } = getState().tree;

    const parents = await getParentEntities(entityNode, languageCode, {
      dataSource,
      currentPropId: currentProp?.id,
      addSourceIds: true,
      addNextBeforeIds: currentProp?.id === CHILD_ID,
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
        const { languageCode, dataSource } = getState().settings;

        const siblings = await getSiblingEntities(entityNode, languageCode, {
          dataSource,
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
      } finally {
        dispatch(setLoadingSiblings({ entityNode, value: false }));
      }
    }
  };

export const preloadSiblings =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedSiblingTreeIds ||
      entityNode.openSiblingTreeIds ||
      !entityNode.nextBeforeIds
    )
      return;

    const { languageCode, dataSource } = getState().settings;
    const siblings = await getSiblingEntities(entityNode, languageCode, {
      dataSource,
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
        const { languageCode, dataSource } = getState().settings;

        const spouses = await getSpouseEntities(entityNode, languageCode, {
          dataSource,
        });

        // This is the client side filter for spouses and/or partners
        const filteredSpousePartnersIds = filterSpousePartnersIds(
          entityNode,
          getState().settings,
        );

        const filteredSpouses = spouses?.filter((spouse) =>
          filteredSpousePartnersIds?.includes(spouse.id),
        );

        dispatch(
          expandSpouses({
            entityNode,
            spouses: filteredSpouses,
            options,
          }),
        );

        if (!entityNode.isRoot)
          addUrlBookmark(entityNode.treeId!, SPOUSE_BOOKMARK_SYMBOL);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoadingSpouses({ entityNode, value: false }));
      }
    }
  };

export const preloadSpouses =
  (entityNode: EntityNode) => async (dispatch, getState) => {
    // do not start preload if there are nodes loaded
    if (
      entityNode.closedSpouseTreeIds ||
      entityNode.openSpouseTreeIds ||
      !entityNode.nextAfterIds
    )
      return;

    const { languageCode, dataSource } = getState().settings;
    const spouses = await getSpouseEntities(entityNode, languageCode, {
      dataSource,
    });

    dispatch(setPreloadedSpouses({ entityNode, spouses }));
  };
