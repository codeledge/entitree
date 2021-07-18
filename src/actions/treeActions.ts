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

export const toggleChildren = (entityNode: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingChildren({ entityNode }));

  if (entityNode.childrenTreeIds) {
    dispatch(collapseChildren({ entityNode }));
  } else if (entityNode._childrenTreeIds) {
    //has cached data
    dispatch(
      expandChildren({
        entityNode,
      }),
    );
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

      dispatch(expandChildren({ entityNode, children }));
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleParents = (entityNode: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingParents({ entityNode }));

  if (entityNode.parentsTreeIds) {
    dispatch(collapseParents({ entityNode }));
  } else if (entityNode._parentsTreeIds) {
    //has cached data
    dispatch(
      expandParents({
        entityNode,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const parents = await getParentEntities(entityNode.upIds!, languageCode, {
        currentPropId: currentProp?.id,
        addUpIds: true,
        addLeftIds: currentProp?.id === CHILD_ID,
      });

      dispatch(expandParents({ entityNode, parents }));
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleSiblings = (entityNode: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingSiblings({ entityNode }));

  if (entityNode.siblingsTreeIds) {
    dispatch(collapseSiblings({ entityNode }));
  } else if (entityNode._siblingsTreeIds) {
    //has cached data
    dispatch(
      expandSiblings({
        entityNode,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;

      const siblings = await getSiblingEntities(
        entityNode.leftIds!,
        languageCode,
        {},
      );

      dispatch(
        expandSiblings({
          entityNode,
          siblings,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleSpouses = (entityNode: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingSpouses({ entityNode }));

  if (entityNode.spousesTreeIds) {
    dispatch(collapseSpouses({ entityNode }));
  } else if (entityNode._spousesTreeIds) {
    //has cached data
    dispatch(
      expandSpouses({
        entityNode,
      }),
    );
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

      dispatch(
        expandSpouses({
          entityNode,
          spouses,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
};
