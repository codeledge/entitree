/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EntityNode } from "types/EntityNode";
import getEntities from "./getEntities";
import getSiblingNode from "./getSiblingNode";
import { sortByBirthDate } from "./sortEntities";

export default async function addNodeSiblings(node: EntityNode) {
  let firstSibling;
  const entities = await getEntities(node.data.leftIds!);
  sortByBirthDate(entities);
  entities.forEach((entity, index) => {
    const siblingNode = getSiblingNode(entity, index);
    siblingNode.depth = node.depth;
    siblingNode.virtualParent = node;
    siblingNode.parent = node.parent;
    const siblingIndex = node.parent.children.indexOf(node); //it will keep prepending to the node index
    node.parent.children.splice(siblingIndex, 0, siblingNode);
    if (!firstSibling) firstSibling = siblingNode;
  });
  return firstSibling;
}
