import { DefaultTheme } from "styled-components";
import { TreeState } from "store/treeSlice";

export const calcBounds = (graph: TreeState, theme: DefaultTheme) => {
  function compare(node) {
    if (node.x > 0 && node.x > graph.maxRight!) graph.maxRight = node.x;
    if (node.x < 0 && node.x < graph.maxLeft!) graph.maxLeft = node.x;
    if (node.y > 0 && node.y > graph.maxBottom!) graph.maxBottom = node.y;
    if (node.y < 0 && node.y < graph.maxTop!) graph.maxTop = node.y;
  }

  graph.root?.siblings?.forEach(compare);
  graph.root?.spouses?.forEach(compare);
  graph.parentNodes?.forEach(compare);
  graph.childNodes?.forEach(compare);

  graph.containerStyle = {
    width:
      2 * Math.max(Math.abs(graph.maxLeft), graph.maxRight) + theme.nodeWidth,
    height:
      2 * Math.max(Math.abs(graph.maxTop), graph.maxBottom) + theme.nodeHeight,
  };
};
