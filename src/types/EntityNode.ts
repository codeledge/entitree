import { BigEntity } from "./Entity";

export type EntityNode = {
  treeId?: string; // gets added afterward
  data: BigEntity;
  parent: EntityNode;
  virtualParent?: EntityNode;
  children: EntityNode[];
  isParent?: boolean;
  isSibling?: boolean;
  isSpouse?: boolean;
  isChild?: boolean;
  depth?: number;
  childNumber?: number;
};
