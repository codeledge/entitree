import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import getNodeUniqueId from "lib/getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";

export const makeNode = (
  entity: Entity,
  childrenProp?: "children" | "parents",
) => {
  const node = hierarchy(
    entity,
    childrenProp ? (d) => d[childrenProp] : undefined,
  ) as EntityNode;

  const descendants = node.descendants();
  descendants.forEach((descendant, index) => {
    descendant.treeId = getNodeUniqueId(descendant);
    if (childrenProp === "parents") {
      descendant.depth = -descendant.depth;
      if (descendant.data.isSibling)
        descendant.virtualParent = descendants[index + 1];
    }
    if (childrenProp === "children") {
      if (descendant.data.isSpouse)
        descendant.virtualParent = descendants[index - 1];
    }
  });

  return node;
};
