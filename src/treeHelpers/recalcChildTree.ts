import { calcBounds } from "./calcTreeBounds";
import treeLayout from "lib/getTreeLayout";

export const recalcChildren = (graph, theme) => {
  treeLayout(graph.childTree);
  graph.childNodes = graph.childTree.descendants().slice(1);
  graph.childRels = graph.childTree.links();
  calcBounds(graph, theme);
};
