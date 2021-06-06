import { Entity } from "./Entity";
import { HierarchyNode } from "d3-hierarchy";

export interface EntityNode extends HierarchyNode<Entity> {
  treeId: string; // gets added afterward
  x: number;
  y: number;
  virtualParent?: EntityNode;
  depth: number; //override readonly field
}

export type UpMap = Record<string, any>;
