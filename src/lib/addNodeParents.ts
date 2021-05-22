/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CHILD_ID } from "../constants/properties";
import { EntityNode } from "types/EntityNode";
import filterSpouses from "./filterSpouses";
import getEntities from "./getEntities";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByGender } from "./sortEntities";
import store from "store";

export default async function addNodeParents(node: EntityNode) {
  if (!node.data.upIds) return;
  const { currentUpMap, currentPropId } = store.getState().navigation;

  const entities = await getEntities(node.data.upIds, {
    upMap: currentUpMap,
    addLeftIds: currentPropId === CHILD_ID,
    addRightIds: currentPropId === CHILD_ID,
  });
  if (currentPropId === CHILD_ID) {
    sortByGender(entities);
  }
  entities.forEach((entity, index) => {
    const parentNode = hierarchy(entity) as EntityNode;
    parentNode.isParent = true;
    parentNode.depth = node.depth! - 1;
    parentNode.parent = node;
    parentNode.treeId = getNodeUniqueId(parentNode, index);
    if (!node.children) {
      node.children = [];
    }
    node.children.push(parentNode);
  });
  if (currentPropId === CHILD_ID) {
    filterSpouses(node);
  }
}
