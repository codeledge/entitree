import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { AppState } from "store";
import { EntityNode } from "types/EntityNode";
import { HYDRATE } from "next-redux-wrapper";

type TreeState = {
  maxLeft?: number;
  maxRight?: number;
  maxTop?: number;
  maxBottom?: number;
  childNodes?: any;
  childRels?: any;
  parentNodes?: any;
  parentRels?: any;
  root?: EntityNode;
  childTree?: EntityNode;
  parentTree?: EntityNode;
  containerWidth?: number;
  containerHeight?: number;
};

const initialState: TreeState = {};

const hydrate = createAction<AppState>(HYDRATE);

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setInitialTree: (state, { payload: { root, childTree, parentTree } }) => {
      state.root = root;
      state.childTree = childTree;
      state.parentTree = parentTree;
    },
    setNodeSiblings: (state, action) => {
      console.log({ action });

      //state.currentEntity = action.payload;
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

export const { setNodeSiblings, setInitialTree } = treeSlice.actions;

export const toggleSiblings = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleSpouses = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleParents = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export const toggleChildren = (node: EntityNode) => (dispatch) =>
  dispatch(setNodeSiblings([]));

export default treeSlice.reducer;
