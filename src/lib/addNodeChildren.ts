/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CHILD_ID } from "../constants/properties";
import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import getEntities from "./getEntities";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByBirthDate } from "./sortEntities";

export default async function addNodeChildren(
  node: EntityNode,
  languageCode: LangCode,
  currentPropId: string,
) {
  if (!node.data.downIds) return;
  const entities = await getEntities(node.data.downIds, languageCode, {
    addDownIds: true,
    addRightIds: currentPropId === CHILD_ID,
  });
  if (currentPropId === CHILD_ID && !node.data.downIdsAlreadySorted) {
    sortByBirthDate(entities);
  }
  addChildEntities(node, entities);
}

export const addChildEntities = (node: EntityNode, childEntities: Entity[]) => {
  childEntities?.forEach((entity, index) => {
    const childNode = hierarchy(entity) as EntityNode;
    childNode.depth = node.depth + 1;
    childNode.parent = node;
    childNode.childNumber = index + 1;
    childNode.treeId = getNodeUniqueId(childNode, index);
    childNode.isChild = true;
    if (!node.children) {
      node.children = [];
    }
    node.children.push(childNode);
  });
};
