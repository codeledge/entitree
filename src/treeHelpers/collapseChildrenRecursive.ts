import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";

export const collapseChildrenRecursive = (entity: Entity) => {
  entity.children?.forEach((child) => {
    if (child.isChild) {
      node._children = node._children || [];
      node._children.push(child);
    }
    // if (child.isSpouse && child.virtualParent) {
    //   child.virtualParent._spouses = child.virtualParent._spouses || [];
    //   child.virtualParent._spouses.push(child);
    // }
    // if (child.isSibling && child.virtualParent) {
    //   child.virtualParent._siblings = child.virtualParent._siblings || [];
    //   child.virtualParent._siblings.push(child);
    // }
  });

  node.children = undefined;

  node._children?.forEach((node) => collapseChildrenRecursive(node));
};
