import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";

export default function getSiblingNode(
  entity: Entity,
  index: number,
): EntityNode {
  const siblingNode = hierarchy(entity) as EntityNode;
  siblingNode.isSibling = true;
  siblingNode.treeId = getNodeUniqueId(siblingNode, index, "sibling");
  return siblingNode;
}
