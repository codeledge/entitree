import { Entity, EntityProp } from "types/Entity";
import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { AppState } from "store";
import { HYDRATE } from "next-redux-wrapper";
import { UpMap } from "types/EntityNode";
import { findEntity } from "treeHelpers/findEntity";

export type TreeState = {
  currentEntity?: Entity;
  currentEntityProps?: EntityProp[];
  currentProp?: EntityProp;
  currentUpMap?: UpMap;
  loadingEntity?: boolean;
  maxLeft: number;
  maxRight: number;
  maxTop: number;
  maxBottom: number;
  childTree?: Entity;
  parentTree?: Entity;
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
    setCurrentEntity: (state, action) => {
      state.currentEntity = action.payload;
    },
    setLoadingEntity: (state, action: PayloadAction<boolean>) => {
      state.currentEntity = undefined;
      state.loadingEntity = action.payload;
    },
    setCurrentProp: (state, action: PayloadAction<EntityProp>) => {
      state.currentProp = action.payload;
    },
    setCurrentEntityProps: (state, action: PayloadAction<EntityProp[]>) => {
      state.currentEntityProps = action.payload;
    },
    setCurrentUpMap: (state, action: PayloadAction<UpMap>) => {
      state.currentUpMap = action.payload;
    },
    setChildTree: (state, { payload: childTree }: PayloadAction<Entity>) => {
      state.childTree = childTree;
    },
    setParentTree: (state, { payload: parentTree }: PayloadAction<Entity>) => {
      state.parentTree = parentTree;
    },
    setLoadingChildren: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (state.childTree) {
        const entityRef = findEntity(state.childTree, entity, "children");
        if (entityRef) entityRef.loadingChildren = true;
      }
    },
    collapseChildren: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (state.childTree) {
        const entityRef = findEntity(state.childTree, entity, "children");
        if (entityRef) {
          entityRef._children = entityRef.children;
          entityRef.children = undefined;
          entityRef.loadingChildren = false;
        }
      }
    },
    expandChildren: (
      state,
      {
        payload: { entity, children },
      }: PayloadAction<{ entity: Entity; children: Entity[] }>,
    ) => {
      if (state.childTree) {
        const entityRef = findEntity(state.childTree, entity, "children");
        if (entityRef) {
          entityRef.children = children;
          entityRef.loadingChildren = false;
        }
      }
    },
    setLoadingParents: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (state.parentTree) {
        const entityRef = findEntity(state.parentTree, entity, "parents");
        if (entityRef) entityRef.loadingParents = true;
      }
    },
    collapseParents: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (state.parentTree) {
        const entityRef = findEntity(state.parentTree, entity, "parents");
        if (entityRef) {
          entityRef._parents = entityRef.parents;
          entityRef.parents = undefined;
          entityRef.loadingParents = false;
        }
      }
    },
    expandParents: (
      state,
      {
        payload: { entity, parents },
      }: PayloadAction<{ entity: Entity; parents: Entity[] }>,
    ) => {
      if (state.parentTree) {
        const entityRef = findEntity(state.parentTree, entity, "parents");
        if (entityRef) {
          entityRef.parents = parents;
          entityRef.loadingParents = false;
        }
      }
    },
    setLoadingSiblings: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (entity.isRoot) {
        state.currentEntity!.loadingSiblings = true;
      }
      if (state.parentTree) {
        const entityRef = findEntity(state.parentTree, entity, "parents");
        if (entityRef) entityRef.loadingSiblings = true;
      }
    },
    collapseSiblings: (
      state,
      {
        payload: { entity, sourceEntity },
      }: PayloadAction<{ entity: Entity; sourceEntity?: Entity }>,
    ) => {
      if (sourceEntity) {
        const entityIndex = sourceEntity.parents!.indexOf(entity);
        let firstSiblingIndex = entityIndex - 1;
        let siblingCount = 1;

        for (let index = firstSiblingIndex - 1; index >= 0; index -= 1) {
          if (sourceEntity.parents![index]?.isSibling) {
            firstSiblingIndex -= 1;
            siblingCount += 1;
          } else break;
        }

        const entityRef = findEntity(state.parentTree!, entity, "parents");
        const sourceRef = findEntity(
          state.parentTree!,
          sourceEntity,
          "parents",
        );

        entityRef!.siblings = undefined;
        entityRef!._siblings = sourceRef!.parents!.splice(
          firstSiblingIndex,
          siblingCount,
        );
        entityRef!.loadingSiblings = false;
      } else {
        state.currentEntity!._siblings = state.currentEntity!.siblings;
        state.currentEntity!.siblings = undefined;
        state.currentEntity!.loadingSiblings = false;
      }
    },
    expandSiblings: (
      state,
      {
        payload: { entity, siblings, sourceEntity },
      }: PayloadAction<{
        entity: Entity;
        siblings: Entity[];
        sourceEntity?: Entity;
      }>,
    ) => {
      //non-root
      if (sourceEntity) {
        const insertIndex = sourceEntity.parents!.indexOf(entity);

        const entityRef = findEntity(state.parentTree!, entity, "parents");
        const sourceRef = findEntity(
          state.parentTree!,
          sourceEntity,
          "parents",
        );

        sourceRef?.parents?.splice(insertIndex, 0, ...siblings);
        entityRef!.siblings = siblings;
        entityRef!.loadingSiblings = false;
      } else {
        state.currentEntity!.siblings = siblings;
        state.currentEntity!.loadingSiblings = false;
      }
    },
    setLoadingSpouses: (
      state,
      { payload: { entity } }: PayloadAction<{ entity: Entity }>,
    ) => {
      if (entity.isRoot) {
        state.currentEntity!.loadingSpouses = true;
      } else if (state.childTree) {
        const entityRef = findEntity(state.childTree, entity, "children");
        if (entityRef) entityRef.loadingSpouses = true;
      }
    },
    collapseSpouses: (
      state,
      {
        payload: { entity, parentEntity },
      }: PayloadAction<{ entity: Entity; parentEntity?: Entity }>,
    ) => {
      if (entity.isRoot) {
        state.currentEntity!._spouses = state.currentEntity!.spouses;
        state.currentEntity!.spouses = undefined;
        state.currentEntity!.loadingSpouses = false;
      } else if (parentEntity) {
        const entityIndex = parentEntity.children!.indexOf(entity);
        const firstSpouseIndex = entityIndex + 1;
        let spouseCount = 1;

        for (
          let index = firstSpouseIndex + 1;
          index < parentEntity.children!.length;
          index += 1
        ) {
          if (parentEntity.children![index]?.isSpouse) spouseCount += 1;
          else break;
        }

        const entityRef = findEntity(state.childTree!, entity, "children");
        const parentRef = findEntity(
          state.childTree!,
          parentEntity,
          "children",
        );

        entityRef!.spouses = undefined;
        entityRef!._spouses = parentRef!.children!.splice(
          firstSpouseIndex,
          spouseCount,
        );
        entityRef!.loadingSpouses = false;
      }
    },
    expandSpouses: (
      state,
      {
        payload: { entity, parentEntity, spouses },
      }: PayloadAction<{
        entity: Entity;
        parentEntity?: Entity;
        spouses: Entity[];
      }>,
    ) => {
      if (entity.isRoot) {
        state.currentEntity!.spouses = spouses;
        state.currentEntity!.loadingSpouses = false;
      } else if (parentEntity) {
        //add spouses after the node index, so that the node stays on the left
        const insertIndex = parentEntity.children!.indexOf(entity) + 1;

        const entityRef = findEntity(state.childTree!, entity, "children");
        const parentRef = findEntity(
          state.childTree!,
          parentEntity,
          "children",
        );
        parentRef?.children?.splice(insertIndex, 0, ...spouses);

        entityRef!.spouses = spouses;
        entityRef!.loadingSpouses = false;
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
  setChildTree,
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setCurrentUpMap,
  setLoadingChildren,
  setLoadingParents,
  setLoadingSiblings,
  setLoadingSpouses,
  setParentTree,
} = treeSlice.actions;

export default treeSlice.reducer;
