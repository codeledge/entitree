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
      {
        payload: { entityNode, value = true },
      }: PayloadAction<{ entityNode: EntityNode; value?: boolean }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingChildren = value;
    },
    collapseChildren: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      const mapEntity = state.entitiesMap?.[entity.treeId!];
      if (!mapEntity || !mapEntity.openChildTreeIds) return;
      mapEntity.closedChildTreeIds = [...mapEntity.openChildTreeIds];
      mapEntity.openChildTreeIds = undefined;
      mapEntity.loadingChildren = false;

      state.fit = {
        leftEntityTreeId: entity.treeId,
        rightEntityTreeId: entity.treeId,
        topEntityTreeId: entity.treeId,
        bottomEntityTreeId: entity.treeId,
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
          mapNode.openChildTreeIds = children.map((child) => child.treeId!);
        } else {
          mapNode.openChildTreeIds = mapNode.closedChildTreeIds;
        }
        mapNode.loadingChildren = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.openChildTreeIds![0],
            rightEntityTreeId: last(mapNode.openChildTreeIds!),
            topEntityTreeId: entityNode.treeId,
            bottomEntityTreeId: mapNode.openChildTreeIds![0],
          };
      }
    },
    setPreloadedChildren: (
      state,
      {
        payload: { entityNode, children },
      }: PayloadAction<{
        entityNode: EntityNode;
        children: Entity[];
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        if (children) {
          children.forEach((child) => {
            if (state.entitiesMap) state.entitiesMap[child.treeId!] = child;
          });
          mapNode.closedChildTreeIds = children.map((child) => child.treeId!);
        }
      }
    },
    setLoadingParents: (
      state,
      {
        payload: { entityNode, value = true },
      }: PayloadAction<{ entityNode: EntityNode; value?: boolean }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingParents = value;
    },
    collapseParents: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      const mapEntity = state.entitiesMap?.[entity.treeId!];
      if (!mapEntity || !mapEntity.openParentTreeIds) return;

      mapEntity.closedParentTreeIds = [...mapEntity.openParentTreeIds];
      mapEntity.openParentTreeIds = undefined;
      mapEntity.loadingParents = false;

      state.fit = {
        leftEntityTreeId: entity.treeId,
        rightEntityTreeId: entity.treeId,
        topEntityTreeId: entity.treeId,
        bottomEntityTreeId: entity.treeId,
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
          mapNode.openParentTreeIds = parents.map((child) => child.treeId!);
        } else {
          mapNode.openParentTreeIds = mapNode.closedParentTreeIds;
        }
        mapNode.loadingParents = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.openParentTreeIds![0],
            rightEntityTreeId: last(mapNode.openParentTreeIds!),
            topEntityTreeId: mapNode.openParentTreeIds![0],
            bottomEntityTreeId: entityNode.treeId,
          };
      }
    },
    setPreloadedParents: (
      state,
      {
        payload: { entityNode, parents },
      }: PayloadAction<{
        entityNode: EntityNode;
        parents: Entity[];
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        if (parents) {
          parents.forEach((parent) => {
            if (state.entitiesMap) state.entitiesMap[parent.treeId!] = parent;
          });
          mapNode.closedParentTreeIds = parents.map((parent) => parent.treeId!);
        }
      }
    },
    setLoadingSiblings: (
      state,
      {
        payload: { entityNode, value = true },
      }: PayloadAction<{ entityNode: EntityNode; value?: boolean }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingSiblings = value;
    },
    collapseSiblings: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        mapNode.closedSiblingTreeIds = mapNode.openSiblingTreeIds;
        mapNode.openSiblingTreeIds = undefined;
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
          mapNode.openSiblingTreeIds = siblings.map((child) => child.treeId!);
        } else {
          mapNode.openSiblingTreeIds = mapNode.closedSiblingTreeIds;
        }
        mapNode.loadingSiblings = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.openSiblingTreeIds![0],
            rightEntityTreeId: last(mapNode.openSiblingTreeIds!),
            topEntityTreeId: mapNode.openSiblingTreeIds![0],
            bottomEntityTreeId: entityNode.treeId,
          };
      }
    },
    setPreloadedSiblings: (
      state,
      {
        payload: { entityNode, siblings },
      }: PayloadAction<{
        entityNode: EntityNode;
        siblings: Entity[];
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        if (siblings) {
          siblings.forEach((sibling) => {
            if (state.entitiesMap) state.entitiesMap[sibling.treeId!] = sibling;
          });
          mapNode.closedSiblingTreeIds = siblings.map(
            (sibling) => sibling.treeId!,
          );
        }
      }
    },
    setLoadingSpouses: (
      state,
      {
        payload: { entityNode, value = true },
      }: PayloadAction<{ entityNode: EntityNode; value?: boolean }>,
    ) => {
      if (state.entitiesMap?.[entityNode.treeId!])
        state.entitiesMap[entityNode.treeId!].loadingSpouses = value;
    },
    collapseSpouses: (
      state,
      { payload: { entityNode } }: PayloadAction<{ entityNode: EntityNode }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        mapNode.closedSpouseTreeIds = mapNode.openSpouseTreeIds;
        mapNode.openSpouseTreeIds = undefined;
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
          spouses.forEach((node) => {
            if (state.entitiesMap) state.entitiesMap[node.treeId!] = node;
          });
          mapNode.openSpouseTreeIds = spouses.map((node) => node.treeId!);
        } else {
          mapNode.openSpouseTreeIds = mapNode.closedSpouseTreeIds;
        }
        mapNode.loadingSpouses = false;

        if (options?.followNavigation !== false)
          state.fit = {
            leftEntityTreeId: mapNode.openSpouseTreeIds![0],
            rightEntityTreeId: last(mapNode.openSpouseTreeIds!),
            topEntityTreeId: entityNode.treeId,
            bottomEntityTreeId: entityNode.treeId,
          };
      }
    },
    setPreloadedSpouses: (
      state,
      {
        payload: { entityNode, spouses },
      }: PayloadAction<{
        entityNode: EntityNode;
        spouses: Entity[];
      }>,
    ) => {
      const mapNode = state.entitiesMap?.[entityNode.treeId!];
      if (mapNode) {
        if (spouses) {
          spouses.forEach((spouse) => {
            if (state.entitiesMap) state.entitiesMap[spouse.treeId!] = spouse;
          });
          mapNode.closedSpouseTreeIds = spouses.map((spouse) => spouse.treeId!);
        }
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
  resetFit,
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setLoadingChildren,
  setLoadingEntity,
  setLoadingParents,
  setLoadingSiblings,
  setLoadingSpouses,
  setPreloadedChildren,
  setPreloadedParents,
  setPreloadedSiblings,
  setPreloadedSpouses,
  setSizes,
} = treeSlice.actions;

export default treeSlice.reducer;
