import { Entity } from "./Entity";
import { HierarchyNode } from "d3-hierarchy";

export interface EntityNode extends HierarchyNode<Entity> {
  treeId?: string; // gets added afterward
  x: number;
  y: number;
  virtualParent?: EntityNode;
  depth: number; //override this field
  isParent?: boolean;
  isSibling?: boolean;
  isSpouse?: boolean;
  isChild?: boolean;
  isRoot?: boolean;
  childNumber?: number;
  loadingSpouses?: boolean;
  _spousesExpanded?: boolean;
  loadingParents?: boolean;
  _parentsExpanded?: boolean;
  loadingSiblings?: boolean;
  _siblingsExpanded?: boolean;
  loadingChildren?: boolean;
  _childrenExpanded?: boolean;
}
