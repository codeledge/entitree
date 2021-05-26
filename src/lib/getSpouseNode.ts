import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";

export default function getSpouseNode(entity: Entity, index: number) {
  const spouseNode = hierarchy(entity) as EntityNode;
  spouseNode.isSpouse = true;
  spouseNode.treeId = getNodeUniqueId(spouseNode, index, "spouse");
  return spouseNode;
}
