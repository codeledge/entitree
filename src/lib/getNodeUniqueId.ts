import { EntityNode } from "types/EntityNode";

export default function getNodeUniqueId(
  node: EntityNode,
  index: number,
  suffix = "",
) {
  let treeId = node.data.id + "-" + index;
  let { parent } = node;
  while (parent) {
    treeId += "_" + parent.treeId;
    parent = parent.parent;
  }
  return treeId + suffix;
}
