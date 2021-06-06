import { EntityNode } from "types/EntityNode";

export default function getNodeUniqueId(node: EntityNode) {
  // eslint-disable-next-line prefer-const
  let treeId = node.data.id;
  let { parent } = node;
  while (parent) {
    treeId += "_" + parent.treeId;
    parent = parent.parent;
  }
  return treeId;
}
