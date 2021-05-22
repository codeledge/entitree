import "./Graph.scss";

import {
  DEFAULT_SCALE,
  DOWN_SYMBOL,
  LEFT_SYMBOL,
  MAX_SCALE,
  MIN_SCALE,
  RIGHT_SYMBOL,
  UP_SYMBOL,
} from "../../constants/tree";
import React, {
  memo,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { addUrlBookmark, removeUrlBookmark } from "../../lib/updateUrlToggles";
import graphReducer, {
  collapseRootSiblings,
  collapseSiblings,
  getInitialState,
} from "./graphReducer";
import styled, { useTheme } from "styled-components";

import { AppContext } from "../../App";
import Navigation from "./Navigation/Navigation";
import Node from "../Node/Node";
import Rel from "../Rel/Rel";
import { TransformComponent } from "react-zoom-pan-pinch";
import { TransformWrapper } from "react-zoom-pan-pinch";
import addNodeChildren from "../../lib/addNodeChildren";
import addNodeParents from "../../lib/addNodeParents";
import addNodeSiblings from "../../lib/addNodeSiblings";
import addNodeSpouses from "../../lib/addNodeSpouses";
import clsx from "clsx";
import debounce from "lodash.debounce";
import getItems from "../../wikidata/getItems";
import getNodeUniqueId from "../../lib/getNodeUniqueId";
import getSiblingNode from "../../lib/getSiblingNode";
import getSpouseNode from "../../lib/getSpouseNode";
import { hierarchy } from "d3-hierarchy";
import last from "../../lib/last";
import { sortByBirthDate } from "../../lib/sortEntities";

export default function GraphWrapper() {
  return (
    <div className="GraphWrapper">
      <TransformWrapper
        zoomIn={{ step: 20 }}
        zoomOut={{ step: 20 }}
        wheel={{ step: 25 }}
        defaultScale={DEFAULT_SCALE}
        options={{
          limitToBounds: false,
          minScale: MIN_SCALE,
          maxScale: MAX_SCALE,
        }}
      >
        {(props) => <Graph {...props} />}
      </TransformWrapper>
    </div>
  );
}

const Graph = memo(
  function ({ setTransform, zoomIn, zoomOut, scale: currentScale, ...props }) {
    const {
      showError,
      currentLang,
      currentEntity,
      currentProp,
      secondLabel,
      setLoadingEntity,
      currentUpMap,
      settings,
    } = useContext(AppContext);
    const theme = useTheme();

    const [graph, dispatchGraph] = useReducer(
      graphReducer,
      getInitialState(theme)
    );
    const [focusedNode, setFocusedNode] = useState();

    const graphRef = useRef();
    const [graphWidth, setGraphWidth] = useState(0);
    const [graphHeight, setGraphHeight] = useState(0);

    useEffect(() => {
      const handleResize = debounce(() => {
        setGraphWidth(graphRef.current.offsetWidth);
        setGraphHeight(graphRef.current.offsetHeight);
      }, 500);
      handleResize();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [graphRef]);

    useEffect(() => {
      //also wait until the container size has been set
      if (currentEntity) {
        (async () => {
          try {
            let root = hierarchy(currentEntity);
            const rootId = getNodeUniqueId(root, 0);
            root.treeId = rootId;
            root.isRoot = true;
            root.x = 0;
            root.y = 0;

            //property has been selected/changed from dropdown or is available from url
            if (currentProp) {
              //annoyingly a repetition but correct in order to have separate trees
              let childTree = hierarchy(currentEntity);
              childTree.treeId = rootId;
              childTree.isRoot = true;
              childTree.x = 0;
              childTree.y = 0;

              let parentTree = hierarchy(currentEntity);
              parentTree.treeId = rootId;
              parentTree.isRoot = true;
              parentTree.x = 0;
              parentTree.y = 0;

              dispatchGraph({
                type: "set",
                theme,
                root,
                childTree,
                parentTree,
              });

              toggleParents(parentTree, {
                noRecenter: true,
              });
              toggleChildren(childTree, {
                noRecenter: true,
              });
              toggleRootSiblings(root, { noRecenter: true });
              toggleRootSpouses(root, { noRecenter: true });

              setLoadingEntity(false);
            } else {
              //currentEntity has changed from searchBox
              dispatchGraph({
                type: "set",
                theme,
                root,
              });
            }

            setFocusedNode(root);
          } catch (error) {
            showError(error);
          }
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      currentEntity,
      currentProp,
      theme.separationCousins,
      theme.separationSameGroup,
      theme.separationSiblingSpouse,
      theme.nodeVerticalSpacing,
    ]);
    //all graph based changes, CSS changes not needed

    const toggleChildren = async (node, options = {}) => {
      if (!node.data.downIds || !node.data.downIds.length) return;

      dispatchGraph({ type: "setLoadingChildren", node, theme });

      if (node._childrenExpanded) {
        removeUrlBookmark(node, DOWN_SYMBOL);
        dispatchGraph({ type: "collapseChildren", node, theme });
      } else if (node._children) {
        //has cached data
        node.children = node._children;
        node._children = null;
        addUrlBookmark(node, DOWN_SYMBOL);
        dispatchGraph({ type: "expandChildren", node, theme });
      } else {
        try {
          await addNodeChildren({
            currentLang,
            currentProp,
            node,
            secondLabel,
            settings,
            theme,
          });
          addUrlBookmark(node, DOWN_SYMBOL);
          dispatchGraph({ type: "expandChildren", node, theme });
        } catch (error) {
          showError(error);
        }
      }

      if (!options.noRecenter) centerPoint(node.x, node.y);
    };

    const toggleParents = async (node, options = {}) => {
      if (!node.data.upIds || !node.data.upIds.length) return;

      dispatchGraph({ type: "setLoadingParents", node, theme });

      if (node._parentsExpanded) {
        removeUrlBookmark(node, UP_SYMBOL);
        dispatchGraph({ type: "collapseParents", node, theme });
      } else if (node._parents) {
        //has cached data
        node.children = node._parents;
        node._parents = null;
        addUrlBookmark(node, UP_SYMBOL);
        dispatchGraph({ type: "expandParents", node, theme });
      } else {
        try {
          await addNodeParents({
            node,
            currentLang,
            currentProp,
            theme,
            currentUpMap,
            secondLabel,
          });
          addUrlBookmark(node, UP_SYMBOL);
          dispatchGraph({ type: "expandParents", node, theme });
        } catch (error) {
          showError(error);
        }
      }

      if (!options.noRecenter) centerPoint(node.x, node.y);
    };

    const toggleSpouses = async (node, options = {}) => {
      if (!node.data.rightIds || !node.data.rightIds.length) return;

      dispatchGraph({ type: "setLoadingSpouses", node, theme });

      let lastSpouse;
      if (node._spousesExpanded) {
        removeUrlBookmark(node, RIGHT_SYMBOL);
        dispatchGraph({ type: "collapseSpouses", node, theme });
      } else if (node._spouses) {
        //cached
        lastSpouse = last(node._spouses);
        addUrlBookmark(node, RIGHT_SYMBOL);
        dispatchGraph({ type: "expandSpouses", node, theme });
      } else {
        try {
          lastSpouse = await addNodeSpouses({
            node,
            currentLang,
            theme,
            settings,
            secondLabel,
          });
          addUrlBookmark(node, RIGHT_SYMBOL);
          dispatchGraph({ type: "expandSpouses", node, theme });
        } catch (error) {
          showError(error);
        }
      }

      let newx = node.x;
      // I don't think the current node should move from the center
      // if (node._spousesExpanded && lastSpouse) {
      //   newx = (newx + lastSpouse.x) / 2;
      // }
      if (!options.noRecenter) centerPoint(newx);
    };

    const toggleSiblings = async (node, options = {}) => {
      if (!node.data.leftIds || !node.data.leftIds.length) return;

      dispatchGraph({ type: "setLoadingSiblings", node, theme });

      let firstSibling;
      if (node._siblingsExpanded) {
        removeUrlBookmark(node, LEFT_SYMBOL);
        // edit the node (ref to a node in the graph) and then update the state
        collapseSiblings(graph, node, theme);
        dispatchGraph({ type: "setGraph", graph, theme });
      } else if (node._siblings) {
        firstSibling = node._siblings[0];
        addUrlBookmark(node, LEFT_SYMBOL);
        dispatchGraph({ type: "expandSiblings", node, theme });
      } else {
        try {
          firstSibling = await addNodeSiblings({
            node,
            currentLang,
            theme,
            settings,
            secondLabel,
          });
          addUrlBookmark(node, LEFT_SYMBOL);
          dispatchGraph({ type: "expandSiblings", node, theme });
        } catch (error) {
          showError(error);
        }
      }

      let newx = node.x;
      // I don't think the current node should move from the center
      // if (node._siblingsExpanded && firstSibling)
      //   newx = (newx + firstSibling.x) / 2;
      if (!options.noRecenter) centerPoint(newx);
    };

    const toggleRootSpouses = async (root, options = {}) => {
      if (!root.data.rightIds || !root.data.rightIds.length) return;

      dispatchGraph({ type: "setLoadingSpouses", node: root, theme });

      if (root._spousesExpanded) {
        dispatchGraph({ type: "collapseRootSpouses", root, theme });
      } else if (root._spouses) {
        dispatchGraph({ type: "expandRootSpouses", root, theme });
      } else {
        try {
          const entities = await getItems(
            root.data.rightIds,
            currentLang.code,
            null,
            theme,
            { secondLabel, rightEntityOption: settings.rightEntityOption }
          );
          const baseX = theme.nodeWidth * theme.separationSiblingSpouse;
          entities.forEach((entity, index) => {
            const spouseNode = getSpouseNode(entity, index);
            spouseNode.x = baseX + baseX * index;
            spouseNode.y = 0;
            spouseNode.depth = 0;
            spouseNode.parent = root;
            if (!root.spouses) root.spouses = [];
            root.spouses.push(spouseNode);
          });
          dispatchGraph({ type: "expandRootSpouses", root, theme });
        } catch (error) {
          showError(error);
        }
      }

      let newx = root.x;
      // if (root.spouses)
      //   newx = (newx + root.spouses[root.spouses.length - 1].x) / 2;
      if (!options.noRecenter) centerPoint(newx);
    };

    const toggleRootSiblings = async (root, options = {}) => {
      if (!root.data.leftIds || !root.data.leftIds.length) return;

      dispatchGraph({ type: "setLoadingSiblings", node: root, theme });

      if (root._siblingsExpanded) {
        collapseRootSiblings(graph, root, theme);
        dispatchGraph({ type: "setGraph", graph });
      } else if (root._siblings) {
        dispatchGraph({ type: "expandRootSiblings", root, theme });
      } else {
        try {
          const entities = await getItems(
            root.data.leftIds,
            currentLang.code,
            null,
            theme,
            { secondLabel }
          );
          const baseX = -(theme.nodeWidth * theme.separationSiblingSpouse);
          sortByBirthDate(entities);
          entities.forEach((entity, index, { length }) => {
            const siblingNode = getSiblingNode(entity, index);
            siblingNode.x = baseX * (length - index);
            siblingNode.y = 0;
            if (!root.siblings) root.siblings = [];
            root.siblings.push(siblingNode);
          });
          dispatchGraph({ type: "expandRootSiblings", root, theme });
        } catch (error) {
          showError(error);
        }
      }

      let newx = root.x;
      // if (root._siblingsExpanded) newx = (newx + root.siblings[0].x) / 2;
      if (!options.noRecenter) centerPoint(newx);
    };

    const fitTree = () => {
      const leftEdge = graph.maxLeft - theme.nodeWidth; //should be theme.nodeWidth / 2 but give some padding
      const topEdge = graph.maxTop - theme.nodeWidth / 2;
      const rightEdge = graph.maxRight + theme.nodeWidth;
      const bottomEdge = graph.maxBottom + theme.nodeWidth / 2;
      const treeWidth = rightEdge - leftEdge;
      const treeHeight = bottomEdge - topEdge;

      let nextScale;
      if (graphWidth - treeWidth < graphHeight - treeHeight) {
        nextScale = graphWidth / treeWidth;
      } else {
        nextScale = graphHeight / treeHeight;
      }
      if (nextScale > MAX_SCALE) nextScale = MAX_SCALE;

      const centerX = leftEdge + treeWidth / 2;
      const centerY = topEdge + treeHeight / 2;

      centerPoint(centerX, centerY, nextScale);
    };

    const centerPoint = (x, y, scale = currentScale) => {
      const halfWidth = graphWidth / 2;
      const calculatedPositionX = halfWidth - (halfWidth + x) * scale;
      let calculatedPositionY = y;
      if (!isNaN(y)) {
        const halfHeight = graphHeight / 2;
        calculatedPositionY = halfHeight - (halfHeight + y) * scale;
      }
      setTransform(calculatedPositionX, calculatedPositionY, scale);
    };

    const recenter = () => {
      centerPoint(focusedNode.x, focusedNode.y);
    };

    const {
      root,
      childTree,
      parentTree,
      containerStyle,
      parentNodes,
      childNodes,
      parentRels,
      childRels,
    } = graph;

    return (
      <ThemedGraph className={clsx("Graph", settings)} ref={graphRef}>
        <TransformComponent>
          <div className="center">
            <svg className="svgContainer" style={containerStyle}>
              <g
                transform={`translate(${containerStyle.width / 2} ${
                  containerStyle.height / 2
                })`}
              >
                <g className="rels">
                  {childRels.map((rel) => (
                    <Rel
                      key={rel.source.treeId + rel.target.treeId}
                      rel={rel}
                    />
                  ))}
                  {parentRels.map((rel) => (
                    <Rel
                      key={rel.source.treeId + rel.target.treeId}
                      rel={rel}
                    />
                  ))}
                  {root &&
                    root.spouses &&
                    root.spouses.map((target) => {
                      return (
                        <Rel
                          key={"root" + target.treeId}
                          rel={{ source: root, target }}
                        />
                      );
                    })}
                  {root &&
                    root.siblings &&
                    root.siblings.map((target) => (
                      <Rel
                        key={"root" + target.treeId}
                        rel={{ source: root, target }}
                      />
                    ))}
                </g>
              </g>
            </svg>
            <div style={containerStyle}>
              <div
                style={{
                  position: "absolute",
                  left: containerStyle.width / 2,
                  top: containerStyle.height / 2,
                }}
              >
                <div className="nodes">
                  {root &&
                    root.siblings &&
                    root.siblings.map((node) => (
                      <Node
                        key={node.treeId}
                        node={node}
                        setFocusedNode={setFocusedNode}
                        focusedNode={focusedNode}
                      />
                    ))}
                  {root && (
                    <Node
                      currentProp={currentProp}
                      toggleChildren={() => {
                        toggleChildren(childTree);
                      }}
                      toggleParents={() => {
                        toggleParents(parentTree);
                      }}
                      toggleSpouses={() => {
                        toggleRootSpouses(root);
                      }}
                      toggleSiblings={() => {
                        toggleRootSiblings(root);
                      }}
                      node={root}
                      setFocusedNode={setFocusedNode}
                      focusedNode={focusedNode}
                    />
                  )}
                  {root &&
                    root.spouses &&
                    root.spouses.map((node) => (
                      <Node
                        key={node.treeId}
                        node={node}
                        setFocusedNode={setFocusedNode}
                        focusedNode={focusedNode}
                      />
                    ))}
                  {childNodes.map((node, index) => (
                    <Node
                      index={index}
                      key={node.treeId}
                      currentProp={currentProp}
                      toggleChildren={toggleChildren}
                      toggleSpouses={toggleSpouses}
                      node={node}
                      setFocusedNode={setFocusedNode}
                      focusedNode={focusedNode}
                    />
                  ))}
                  {parentNodes.map((node, index) => (
                    <Node
                      key={node.treeId}
                      index={index}
                      currentProp={currentProp}
                      toggleSiblings={toggleSiblings}
                      toggleParents={toggleParents}
                      node={node}
                      setFocusedNode={setFocusedNode}
                      focusedNode={focusedNode}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TransformComponent>
        <Navigation
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          focusedNode={focusedNode}
          recenter={recenter}
          fitTree={fitTree}
        />
      </ThemedGraph>
    );
  },
  (prevProps, nextProps) => {
    //return prevProps.scale === nextProps.scale;
    return true; //better performance but inconsistent scale
  }
);

const ThemedGraph = styled.div`
  background-color: ${({ theme }) => theme.graphBackgroundColor};
`;
