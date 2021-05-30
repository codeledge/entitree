import { AppState, AppThunk } from "store";
import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { EntityNode } from "types/EntityNode";
import { HYDRATE } from "next-redux-wrapper";
import { Theme } from "constants/themes";
import addNodeChildren from "lib/addNodeChildren";
import treeLayout from "lib/getTreeLayout";

type TreeState = {
  maxLeft: number;
  maxRight: number;
  maxTop: number;
  maxBottom: number;
  childNodes?: any;
  childRels?: any;
  parentNodes?: any;
  parentRels?: any;
  root?: EntityNode;
  childTree?: EntityNode;
  parentTree?: EntityNode;
  containerWidth?: number;
  containerHeight?: number;
  containerStyle?: {
    width: number;
    height: number;
  };
};

const initialState: TreeState = {
  maxRight: 0,
  maxLeft: 0,
  maxBottom: 0,
  maxTop: 0,
};

const hydrate = createAction<AppState>(HYDRATE);

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setInitialTree: (
      state,
      {
        payload: { root, childTree, parentTree, theme },
      }: PayloadAction<{
        root: EntityNode;
        childTree?: EntityNode;
        parentTree?: EntityNode;
        theme: Theme;
      }>,
    ) => {
      state.root = root;

      if (childTree) {
        treeLayout(childTree);
        state.childTree = childTree;
        state.childNodes = childTree.descendants().slice(1);
        state.childRels = childTree.links();
      }

      if (parentTree) {
        treeLayout(parentTree);
        state.parentTree = parentTree;
        state.parentNodes = parentTree.descendants().slice(1);
        state.parentRels = parentTree.links();
      }

      calcBounds(state as TreeState, theme);
    },
    setNodeSiblings: (state, action) => {
      console.log({ action });

      //state.currentEntity = action.payload;
    },
    collapseChildren: (state, { payload: { node, theme } }) => {
      node.loadingChildren = false;
      if (node.isRoot) {
        state.root!._childrenExpanded = false;
        state.root!.loadingChildren = false;
      }
      collapseChildren(node);
      recalcChildren(state, theme);
    },
    expandChildren: (state, { payload: { node, theme } }) => {
      node._childrenExpanded = true;
      node.loadingChildren = false;
      if (node.isRoot) {
        state.root!._childrenExpanded = true;
        state.root!.loadingChildren = false;
      }
      recalcChildren(state, theme);
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrate, (state, action) => {
      return {
        ...state,
        ...action.payload[treeSlice.name],
      };
    });
  },
});

export const recalcChildren = (graph, theme) => {
  treeLayout(graph.childTree);
  graph.childNodes = graph.childTree.descendants().slice(1);
  graph.childRels = graph.childTree.links();
  calcBounds(graph, theme);
};

const calcBounds = (graph: TreeState, theme: Theme) => {
  function compare(node) {
    if (node.x > 0 && node.x > graph.maxRight!) graph.maxRight = node.x;
    if (node.x < 0 && node.x < graph.maxLeft!) graph.maxLeft = node.x;
    if (node.y > 0 && node.y > graph.maxBottom!) graph.maxBottom = node.y;
    if (node.y < 0 && node.y < graph.maxTop!) graph.maxTop = node.y;
  }

  if (graph.root?.siblings) graph.root.siblings.forEach(compare);
  if (graph.root?.spouses) graph.root.spouses.forEach(compare);
  if (graph.parentNodes) graph.parentNodes.forEach(compare);
  if (graph.childNodes) graph.childNodes.forEach(compare);

  graph.containerStyle = {
    width:
      2 * Math.max(Math.abs(graph.maxLeft), graph.maxRight) + theme.nodeWidth,
    height:
      2 * Math.max(Math.abs(graph.maxTop), graph.maxBottom) + theme.nodeHeight,
  };
};

export const {
  setNodeSiblings,
  setInitialTree,
  collapseChildren,
  expandChildren,
} = treeSlice.actions;

export const toggleSiblings = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleSpouses = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleParents = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleChildren = (node: EntityNode): AppThunk => async (
  dispatch,
  getState,
) => {
  if (node._childrenExpanded) {
    dispatch(collapseChildren(node));
  } else if (node._children) {
    //has cached data
    node.children = node._children;
    node._children = undefined;
    dispatch(expandChildren(node));
  } else {
    try {
      const { languageCode } = getState().settings;
      const { currentProp } = getState().navigation;
      await addNodeChildren(node, languageCode, currentProp.id);
      dispatch(expandChildren(node));
    } catch (error) {
      console.error(error);
    }
  }
};

export default treeSlice.reducer;
