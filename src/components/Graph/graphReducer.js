import treeLayout from "../../lib/getTreeLayout";

export const getInitialState = (theme) => {
  return {
    maxLeft: -theme.nodeWidth,
    maxRight: theme.nodeWidth,
    maxTop: -theme.nodeHeight,
    maxBottom: theme.nodeHeight,
    childNodes: [],
    childRels: [],
    parentNodes: [],
    parentRels: [],
    childTree: {},
    parentTree: {},
    containerStyle: {
      width: 2 * theme.nodeWidth,
      height: 2 * theme.nodeHeight,
    },
    root: null,
  };
};

export default function graphReducer(graph, { type, theme, ...arg }) {
  //console.log({ type });
  switch (type) {
    case "set":
      return {
        ...getInitialState(theme),
        ...arg,
      };
    case "setGraph": {
      let { graph } = arg;
      return {
        ...graph,
      };
    }
    case "relayoutGraph": {
      let { graph } = arg;
      recalcChildren(graph, theme);
      recalcParents(graph, theme);
      return {
        ...graph,
      };
    }
    case "expandChildren": {
      let { node } = arg;
      if (node._childrenExpanded) return graph; //no-op
      node._childrenExpanded = true;
      node.loadingChildren = false;
      if (node.isRoot) {
        graph.root._childrenExpanded = true;
        graph.root.loadingChildren = false;
      }
      recalcChildren(graph, theme);
      return { ...graph };
    }
    case "collapseChildren": {
      let newGraph = { ...graph };
      let { node } = arg;
      node.loadingChildren = false;
      if (node.isRoot) {
        newGraph.root._childrenExpanded = false;
        newGraph.root.loadingChildren = false;
      }
      collapseChildren(node);
      recalcChildren(newGraph, theme);
      return newGraph;
    }
    case "setLoadingChildren": {
      let { node } = arg;
      node.loadingChildren = true;
      if (node.isRoot) graph.root.loadingChildren = true;
      return { ...graph };
    }
    case "setLoadingParents": {
      let { node } = arg;
      node.loadingParents = true;
      if (node.isRoot) graph.root.loadingParents = true;
      return { ...graph };
    }
    case "expandParents": {
      let { node } = arg;
      if (node._parentsExpanded) return graph; //no-op
      node._parentsExpanded = true;
      node.loadingParents = false;
      if (node.isRoot) {
        //replicate on root
        graph.root._parentsExpanded = true;
        graph.root.loadingParents = false;
      }
      recalcParents(graph, theme);
      return { ...graph };
    }
    case "collapseParents": {
      let { node } = arg;
      node.loadingParents = false;
      if (node.isRoot) {
        //replicate on root
        graph.root._parentsExpanded = false;
        graph.root.loadingParents = false;
      }
      collapseParents(node);
      recalcParents(graph, theme);
      return { ...graph };
    }
    case "setLoadingSpouses": {
      let { node } = arg;
      node.loadingSpouses = true;
      return graph;
    }
    case "expandSpouses": {
      let { node } = arg;
      node._spousesExpanded = true;
      if (node._spouses) {
        const spouseIndex = node.parent.children.indexOf(node) + 1;
        //add spouses after the node index, so that the node stays on the left
        node.parent.children.splice(spouseIndex, 0, ...node._spouses);
        node._spouses = null;
      }
      if (node.isChild) recalcChildren(graph, theme);
      if (node.isParent) recalcParents(graph, theme);
      node.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseSpouses": {
      let newGraph = { ...graph };
      let { node } = arg;
      node._spousesExpanded = false;
      node.loadingSpouses = false;
      const spouses = [];
      const rest = [];
      node.parent.children.forEach((adjacent) => {
        if (adjacent.isSpouse && adjacent.virtualParent === node) {
          spouses.push(adjacent);
        } else {
          rest.push(adjacent);
        }
      });
      node._spouses = spouses;
      node.parent.children = rest;
      if (node.isChild) recalcChildren(newGraph, theme);
      if (node.isParent) recalcParents(newGraph, theme);
      return newGraph;
    }
    case "setLoadingSiblings": {
      let { node } = arg;
      node.loadingSiblings = true;
      return { ...graph };
    }
    case "expandSiblings": {
      let { node } = arg;
      node._siblingsExpanded = true;
      if (node._siblings) {
        const nodeAsSiblingIndex = node.parent.children.indexOf(node);
        //add siblings before the node index, so that the node stays on the right
        node.parent.children.splice(nodeAsSiblingIndex, 0, ...node._siblings);
        node._siblings = null;
      }
      if (node.isChild) recalcChildren(graph, theme);
      if (node.isParent) recalcParents(graph, theme);
      node.loadingSiblings = false;
      return { ...graph };
    }
    case "expandRootSpouses": {
      let { root } = arg;
      root._spousesExpanded = true;
      if (root._spouses) root.spouses = root._spouses;
      calcBounds(graph, theme);
      root.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseRootSpouses": {
      let { root } = arg;
      root._spousesExpanded = false;
      root._spouses = root.spouses;
      root.spouses = null;
      calcBounds(graph, theme);
      root.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseRootSiblings": {
      let { root } = arg;
      root._siblingsExpanded = false;
      root._siblings = [...root.siblings];
      root.siblings = null;
      calcBounds(graph, theme);
      root.loadingSiblings = false;
      return { ...graph };
    }
    case "expandRootSiblings": {
      let { root } = arg;
      if (root._siblings) root.siblings = root._siblings;
      calcBounds(graph, theme);
      root._siblingsExpanded = true;
      root.loadingSiblings = false;
      return { ...graph };
    }
    default:
      throw new Error("Unknown action type " + type);
  }
}

export const collapseSiblings = (graph, node, theme) => {
  const siblings = [];
  const rest = [];
  node.parent.children.forEach((adjecent) => {
    if (adjecent.isSibling && adjecent.virtualParent === node)
      siblings.push(adjecent);
    else rest.push(adjecent);
  });
  node._siblings = siblings;
  node.parent.children = rest;
  if (node.isChild) recalcChildren(graph, theme);
  if (node.isParent) recalcParents(graph, theme);
  node.loadingSiblings = false;
  node._siblingsExpanded = false;
};

export const collapseRootSiblings = (graph, root, theme) => {
  root._siblingsExpanded = false;
  root._siblings = root.siblings;
  root.siblings = null;
  calcBounds(graph, theme);
  root.loadingSiblings = false;
};

export const recalcChildren = (graph, theme) => {
  treeLayout(graph.childTree);
  graph.childNodes = graph.childTree.descendants().slice(1);
  graph.childRels = graph.childTree.links();
  calcBounds(graph, theme);
};

export const recalcParents = (graph, theme) => {
  treeLayout(graph.parentTree);
  graph.parentNodes = graph.parentTree.descendants().slice(1);
  graph.parentRels = graph.parentTree.links();
  calcBounds(graph, theme);
};

const calcBounds = (graph, theme) => {
  graph.maxRight = 0;
  graph.maxLeft = 0;
  graph.maxBottom = 0;
  graph.maxTop = 0;

  function compare(node) {
    if (node.x > 0 && node.x > graph.maxRight) graph.maxRight = node.x;
    if (node.x < 0 && node.x < graph.maxLeft) graph.maxLeft = node.x;
    if (node.y > 0 && node.y > graph.maxBottom) graph.maxBottom = node.y;
    if (node.y < 0 && node.y < graph.maxTop) graph.maxTop = node.y;
  }

  if (graph.root.siblings) graph.root.siblings.forEach(compare);
  if (graph.root.spouses) graph.root.spouses.forEach(compare);
  if (graph.parentNodes) graph.parentNodes.forEach(compare);
  if (graph.childNodes) graph.childNodes.forEach(compare);

  graph.containerStyle = {
    width:
      2 * Math.max(Math.abs(graph.maxLeft), graph.maxRight) + theme.nodeWidth,
    height:
      2 * Math.max(Math.abs(graph.maxTop), graph.maxBottom) + theme.nodeHeight,
  };
};

const collapseChildren = (node) => {
  if (!node._childrenExpanded) return;
  node.children.forEach((child) => {
    if (child.isChild) {
      child._siblingsExpanded = false;
      child._spousesExpanded = false;
      node._children = node._children || [];
      node._children.push(child);
    }
    if (child.isSpouse) {
      child.virtualParent._spouses = child.virtualParent._spouses || [];
      child.virtualParent._spouses.push(child);
    }
    if (child.isSibling) {
      child.virtualParent._siblings = child.virtualParent._siblings || [];
      child.virtualParent._siblings.push(child);
    }
  });

  node.children = null;
  node._childrenExpanded = false;

  node._children.forEach((node) => collapseChildren(node));
};

const collapseParents = (node) => {
  if (!node._parentsExpanded) return;
  node.children.forEach((child) => {
    if (child.isParent) {
      child._siblingsExpanded = false;
      child._spousesExpanded = false;
      node._parents = node._parents || [];
      node._parents.push(child);
    }
    if (child.isSpouse) {
      child.virtualParent._spouses = child.virtualParent._spouses || [];
      child.virtualParent._spouses.push(child);
    }
    if (child.isSibling) {
      child.virtualParent._siblings = child.virtualParent._siblings || [];
      child.virtualParent._siblings.push(child);
    }
  });

  node.children = null;
  node._parentsExpanded = false;

  node._parents.forEach((node) => collapseParents(node));
};
