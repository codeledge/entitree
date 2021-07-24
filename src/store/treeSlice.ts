import { Entity, EntityProp } from "types/Entity";
import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { AppState } from "store";
import { EntityNode } from "types/EntityNode";
import { HYDRATE } from "next-redux-wrapper";
import { ToggleOptions } from "types/ToggleOptions";
import last from "lib/last";

export type TreeState = {
  currentEntity?: Entity;
  entitiesMap?: Record<string, Entity>;
  currentEntityProps?: EntityProp[];
  currentProp?: EntityProp;
  fit?: {
    bottomEntityTreeId: Entity["treeId"];
    leftEntityTreeId: Entity["treeId"];
    rightEntityTreeId: Entity["treeId"];
    topEntityTreeId: Entity["treeId"];
  };
  height: number;
  loadingEntity?: boolean;
  maxBottom: number;
  maxLeft: number;
  maxRight: number;
  maxTop: number;
  width: number;
};

const initialState: TreeState = {
  height: 0,
  maxBottom: 0,
  maxLeft: 0,
  maxRight: 0,
  maxTop: 0,
  width: 0,
};

const hydrate = createAction<AppState>(HYDRATE);

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    reset: () => ({
      ...initialState,
      loadingEntity: true,
    }),
    resetFit: (state) => {
      state.fit = undefined;
    },
    setSizes: (
      state,
      {
        payload,
      }: PayloadAction<{
        maxLeft: number;
        maxRight: number;
        maxTop: number;
        maxBottom: number;
        width: number;
        height: number;
      }>,
    ) => {
      state.maxLeft = payload.maxLeft;
      state.maxRight = payload.maxRight;
      state.maxTop = payload.maxTop;
      state.maxBottom = payload.maxBottom;
      state.width = payload.width;
      state.height = payload.height;
    },
    setCurrentEntity: (
      state,
      { payload: currentEntity }: PayloadAction<Entity>,
    ) => {
      state.currentEntity = currentEntity;
      state.entitiesMap = {
        [currentEntity.treeId!]: currentEntity,
      };
      state.loadingEntity = false;
    },
    setCurrentProp: (state, action: PayloadAction<EntityProp>) => {
      state.currentProp = action.payload;
    },
    setCurrentEntityProps: (state, action: PayloadAction<EntityProp[]>) => {
      state.currentEntityProps = action.payload;
    },
    setLoadingEntity: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingEntity = payload;
    },
    setLoadingChildren: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingChildren = true;
    },
    collapseChildren: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapEntity = state.entitiesMap?.[entityNode.treeId!];
      if (!mapEntity || !mapEntity.childrenTreeIds) return;
      mapEntity._childrenTreeIds = [...mapEntity.childrenTreeIds];
      mapEntity.childrenTreeIds = undefined;
      mapEntity.loadingChildren = false;

      state.fit = {
        leftEntityTreeId: entityNode.treeId,
        rightEntityTreeId: entityNode.treeId,
        topEntityTreeId: entityNode.treeId,
        bottomEntityTreeId: entityNode.treeId,
      };
    },
    expandChildren: (
      state,
      {
        payload: { entityNode, children, options },
      }: PayloadAction<{
        entityNode: EntityNode;
        children?: Entity[];
        options?: ToggleOptions;
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        if (children) {
          children.forEach((child) => {
            if (state.entitiesMap) state.entitiesMap[child.treeId!] = child;
          });
          mapNode.childrenTreeIds = children.map((child) => child.treeId!);
        } else {
          mapNode.childrenTreeIds = mapNode._childrenTreeIds;
        }
        mapNode.loadingChildren = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.childrenTreeIds![0],
            rightEntityTreeId: last(mapNode.childrenTreeIds!),
            topEntityTreeId: entityNode.treeId,
            bottomEntityTreeId: mapNode.childrenTreeIds![0],
          };
      }
    },
    setLoadingParents: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingParents = true;
    },
    collapseParents: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapEntity = state.entitiesMap?.[entityNode.treeId!];
      if (!mapEntity || !mapEntity.parentsTreeIds) return;

      mapEntity._parentsTreeIds = [...mapEntity.parentsTreeIds];
      mapEntity.parentsTreeIds = undefined;
      mapEntity.loadingParents = false;

      state.fit = {
        leftEntityTreeId: entityNode.treeId,
        rightEntityTreeId: entityNode.treeId,
        topEntityTreeId: entityNode.treeId,
        bottomEntityTreeId: entityNode.treeId,
      };
    },
    expandParents: (
      state,
      {
        payload: { entityNode, parents, options },
      }: PayloadAction<{
        entityNode: EntityNode;
        parents?: Entity[];
        options?: ToggleOptions;
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];

      if (mapNode) {
        if (parents) {
          parents.forEach((parent) => {
            if (state.entitiesMap) state.entitiesMap[parent.treeId!] = parent;
          });
          mapNode.parentsTreeIds = parents.map((child) => child.treeId!);
        } else {
          mapNode.parentsTreeIds = mapNode._parentsTreeIds;
        }
        mapNode.loadingParents = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.parentsTreeIds![0],
            rightEntityTreeId: last(mapNode.parentsTreeIds!),
            topEntityTreeId: mapNode.parentsTreeIds![0],
            bottomEntityTreeId: entityNode.treeId,
          };
      }
    },
    setLoadingSiblings: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingSiblings = true;
    },
    collapseSiblings: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        mapNode._siblingsTreeIds = mapNode.siblingsTreeIds;
        mapNode.siblingsTreeIds = undefined;
        mapNode.loadingSiblings = false;

        state.fit = {
          leftEntityTreeId: entityNode.treeId,
          rightEntityTreeId: entityNode.treeId,
          topEntityTreeId: entityNode.treeId,
          bottomEntityTreeId: entityNode.treeId,
        };
      }
    },
    expandSiblings: (
      state,
      {
        payload: { entityNode, siblings, options },
      }: PayloadAction<{
        entityNode: EntityNode;
        siblings?: Entity[];
        options?: ToggleOptions;
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];

      if (mapNode) {
        if (siblings) {
          siblings.forEach((sibling) => {
            if (state.entitiesMap) state.entitiesMap[sibling.treeId!] = sibling;
          });
          mapNode.siblingsTreeIds = siblings.map((child) => child.treeId!);
        } else {
          mapNode.siblingsTreeIds = mapNode._siblingsTreeIds;
        }
        mapNode.loadingSiblings = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.siblingsTreeIds![0],
            rightEntityTreeId: last(mapNode.siblingsTreeIds!),
            topEntityTreeId: mapNode.siblingsTreeIds![0],
            bottomEntityTreeId: entityNode.treeId,
          };
      }
    },
    setLoadingSpouses: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingSpouses = true;
    },
    collapseSpouses: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        mapNode._spousesTreeIds = mapNode.spousesTreeIds;
        mapNode.spousesTreeIds = undefined;
        mapNode.loadingSpouses = false;

        state.fit = {
          leftEntityTreeId: entityNode.treeId,
          rightEntityTreeId: entityNode.treeId,
          topEntityTreeId: entityNode.treeId,
          bottomEntityTreeId: entityNode.treeId,
        };
      }
    },
    expandSpouses: (
      state,
      {
        payload: { entityNode, spouses, options },
      }: PayloadAction<{
        entityNode: EntityNode;
        spouses?: Entity[];
        options?: ToggleOptions;
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];

      if (mapNode) {
        if (spouses) {
          spouses.forEach((sibling) => {
            if (state.entitiesMap) state.entitiesMap[sibling.treeId!] = sibling;
          });
          mapNode.spousesTreeIds = spouses.map((child) => child.treeId!);
        } else {
          mapNode.spousesTreeIds = mapNode._spousesTreeIds;
        }
        mapNode.loadingSpouses = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.spousesTreeIds![0],
            rightEntityTreeId: last(mapNode.spousesTreeIds!),
            topEntityTreeId: mapNode.spousesTreeIds![0],
            bottomEntityTreeId: entityNode.treeId,
          };
      }
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

export const {
  collapseChildren,
  collapseParents,
  collapseSiblings,
  collapseSpouses,
  expandChildren,
  expandParents,
  expandSiblings,
  expandSpouses,
  reset,
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setLoadingChildren,
  setLoadingEntity,
  setLoadingParents,
  setLoadingSiblings,
  setLoadingSpouses,
  setSizes,
  resetFit,
} = treeSlice.actions;

export default treeSlice.reducer;
