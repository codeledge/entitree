import { Entity } from "./Entity";
import { TreeNode } from "entitree-flex";

export type EntityNode = TreeNode<Entity>;

export type UpMap = Record<string, any>;
