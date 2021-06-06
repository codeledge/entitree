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

export const toggleChildren = (node: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingChildren({ entity: node.data }));

  if (node.data.children) {
    dispatch(collapseChildren({ entity: node.data }));
  } else if (node.data._children) {
    //has cached data
    dispatch(
      expandChildren({
        entity: node.data,
        children: node.data._children,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().tree;

      const children = await getChildEntities(
        node.data.downIds!,
        languageCode,
        {
          currentPropId: currentProp?.id,
          addDownIds: true,
          addRightIds: currentProp?.id === CHILD_ID,
          downIdsAlreadySorted: node.data.downIdsAlreadySorted,
        },
      );

      dispatch(expandChildren({ entity: node.data, children }));
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleParents = (node: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingParents({ entity: node.data }));

  if (node.data.parents) {
    dispatch(collapseParents({ entity: node.data }));
  } else if (node.data._parents) {
    //has cached data
    dispatch(
      expandParents({
        entity: node.data,
        parents: node.data._parents,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp, currentUpMap } = getState().tree;

      const parents = await getParentEntities(
        currentUpMap[node.data.id],
        languageCode,
        {
          currentPropId: currentProp?.id,
          upMap: currentUpMap,
          addLeftIds: currentProp?.id === CHILD_ID,
        },
      );

      dispatch(expandParents({ entity: node.data, parents }));
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleSiblings = (node: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingSiblings({ entity: node.data }));

  if (node.data.siblings) {
    dispatch(
      collapseSiblings({ entity: node.data, sourceEntity: node.parent?.data }),
    );
  } else if (node.data._siblings) {
    //has cached data
    dispatch(
      expandSiblings({
        entity: node.data,
        siblings: node.data._siblings,
        sourceEntity: node.parent?.data,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;

      const siblings = await getSiblingEntities(
        node.data.leftIds!,
        languageCode,
        {},
      );

      dispatch(
        expandSiblings({
          entity: node.data,
          siblings,
          sourceEntity: node.parent?.data,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
};

export const toggleSpouses = (node: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingSpouses({ entity: node.data }));

  if (node.data.spouses) {
    dispatch(
      collapseSpouses({ entity: node.data, parentEntity: node.parent?.data }),
    );
  } else if (node.data._spouses) {
    //has cached data
    dispatch(
      expandSpouses({
        entity: node.data,
        parentEntity: node.parent?.data,
        spouses: node.data._spouses,
      }),
    );
  } else {
    try {
      const { languageCode } = getState().settings;

      const spouses = await getSpouseEntities(
        node.data.rightIds!,
        languageCode,
      );

      dispatch(
        expandSpouses({
          entity: node.data,
          parentEntity: node.parent?.data,
          spouses,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
};
