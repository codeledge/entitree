/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CHILD_ID } from "../constants/properties";
import { EntityNode } from "types/EntityNode";
import getEntities from "./getEntities";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByBirthDate } from "./sortEntities";
import store from "store";

export default async function addNodeChildren(node: EntityNode) {
  if (!node.data.downIds) return;
  const { currentPropId } = store.getState().navigation;
  const entities = await getEntities(node.data.downIds, {
    addDownIds: true,
    addRightIds: currentPropId === CHILD_ID,
  });
  if (currentPropId === CHILD_ID && !node.data.downIdsAlreadySorted) {
    sortByBirthDate(entities);
  }
  entities.forEach((entity, index) => {
    if (entity.isHuman && entity.isInfantDeath) return;
    const childNode = hierarchy(entity) as EntityNode;
    childNode.depth = node.depth! + 1;
    childNode.parent = node;
    childNode.childNumber = index + 1;
    childNode.treeId = getNodeUniqueId(childNode, index);
    childNode.isChild = true;
    if (!node.children) {
      node.children = [];
    }
    node.children.push(childNode);
  });
}
