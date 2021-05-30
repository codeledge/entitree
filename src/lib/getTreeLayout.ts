import { defaultTheme } from "constants/themes";
import { tree } from "d3-hierarchy";

const treeLayout = tree();

export const setTreeLayout = (theme) => {
  treeLayout.nodeSize([
    theme.nodeWidth,
    theme.nodeHeight + theme.nodeVerticalSpacing,
  ]);
  treeLayout.separation((next: any, prev: any) => {
    if (next.isSpouse) return theme.separationSiblingSpouse;
    if (prev.isSpouse && !next.isSpouse) return theme.separationCousins;

    if (prev.isSibling) return theme.separationSiblingSpouse;
    if (next.isSibling && !prev.isSibling) return theme.separationCousins;

    if (next.parent === prev.parent) return theme.separationSameGroup;

    if (next.parent !== prev.parent) return theme.separationCousins;

    return 0; //to make ts happy
  });
};

setTreeLayout(defaultTheme);

export default treeLayout;
