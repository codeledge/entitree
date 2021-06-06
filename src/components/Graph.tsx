import styled, { useTheme } from "styled-components";
import { useEffect, useRef, useState } from "react";

import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import Navigation from "components/Navigation";
import Rel from "components/Rel";
import { RelData } from "types/RelData";
import { TransformComponent } from "react-zoom-pan-pinch";
import { makeNode } from "treeHelpers/makeNode";
import { showError } from "store/alertSlice";
import treeLayout from "lib/getTreeLayout";
import { useAppSelector } from "store";

// import useElementSize from "hooks/useElementSize";

export default function Graph(props) {
  const settings = useAppSelector(({ settings: s }) => s);

  const { currentEntity, parentTree, childTree } = useAppSelector(
    ({ tree }) => tree,
  );
  const graphRef = useRef(null);

  // const { width, height } = useElementSize(graphRef);

  const theme = useTheme();

  const [rootNode, setRootNode] = useState<EntityNode>();
  const [childNodes, setChildNodes] = useState<EntityNode[]>([]);
  const [parentNodes, setParentNodes] = useState<EntityNode[]>([]);
  const [rootSiblings, setRootSiblings] = useState<EntityNode[]>();
  const [rootSpouses, setRootSpouses] = useState<EntityNode[]>();
  const [childRels, setChildRels] = useState<RelData[]>();
  const [parentRels, setParentRels] = useState<RelData[]>();
  const [containerStyle, setContainerStyle] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (currentEntity) {
      const rootNode = makeNode(currentEntity);
      setRootNode(rootNode);

      setRootSiblings(
        currentEntity.siblings?.map((sibling, index, { length }) => {
          const siblingNode = makeNode(sibling);
          const baseX = -(theme.nodeWidth * theme.separationSiblingSpouse);
          siblingNode.x = baseX * (length - index);
          siblingNode.y = 0;
          siblingNode.depth = 0;
          return siblingNode;
        }),
      );

      setRootSpouses(
        currentEntity.spouses?.map((spouse, index) => {
          const spouseNode = makeNode(spouse);
          const baseX = theme.nodeWidth * theme.separationSiblingSpouse;
          spouseNode.x = baseX + baseX * index;
          spouseNode.y = 0;
          spouseNode.depth = 0;
          return spouseNode;
        }),
      );

      if (childTree) {
        const childHierarchy = makeNode(childTree, "children");
        treeLayout(childHierarchy);
        setChildNodes(childHierarchy.descendants().slice(1));
        setChildRels(childHierarchy.links() as RelData[]);
      }

      if (parentTree) {
        const parentHierarchy = makeNode(parentTree, "parents");
        treeLayout(parentHierarchy);
        setParentNodes(parentHierarchy.descendants().slice(1));
        setParentRels(parentHierarchy.links() as RelData[]);
      }
    }
  }, [currentEntity, childTree, parentTree]);

  useEffect(() => {
    calcBounds();
  }, [rootNode, parentNodes, childNodes]);

  const calcBounds = () => {
    let maxRight = 0;
    let maxLeft = 0;
    let maxBottom = 0;
    let maxTop = 0;
    function compare(node) {
      if (node.x > 0 && node.x > maxRight!) maxRight = node.x;
      if (node.x < 0 && node.x < maxLeft!) maxLeft = node.x;
      if (node.y > 0 && node.y > maxBottom!) maxBottom = node.y;
      if (node.y < 0 && node.y < maxTop!) maxTop = node.y;
    }

    rootNode?.data.siblings?.forEach(compare);
    rootNode?.data.spouses?.forEach(compare);
    parentNodes?.forEach(compare);
    childNodes?.forEach(compare);

    setContainerStyle({
      width: 2 * Math.max(Math.abs(maxLeft), maxRight) + theme.nodeWidth,
      height: 2 * Math.max(Math.abs(maxTop), maxBottom) + theme.nodeHeight,
    });
  };

  return (
    <ThemedGraph ref={graphRef}>
      <TransformComponent>
        {containerStyle && (
          <Center
            style={{
              transform: `translate(-${containerStyle.width / 2}px, -${
                containerStyle.height / 2
              }px)`,
            }}
          >
            <RelsContainer style={containerStyle}>
              <g
                transform={`translate(${containerStyle.width / 2} ${
                  containerStyle.height / 2
                })`}
              >
                {parentRels?.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
                ))}
                {childRels?.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
                ))}
                {rootNode &&
                  rootSiblings?.map((node) => (
                    <Rel
                      key={node.treeId + rootNode.treeId}
                      rel={{ source: node, target: rootNode }}
                    />
                  ))}
                {rootNode &&
                  rootSpouses?.map((node) => (
                    <Rel
                      key={node.treeId + rootNode.treeId}
                      rel={{ source: node, target: rootNode }}
                    />
                  ))}
              </g>
            </RelsContainer>
            <NodesContainer style={containerStyle}>
              <div
                style={{
                  position: "absolute",
                  left: containerStyle.width / 2,
                  top: containerStyle.height / 2,
                }}
              >
                {parentNodes?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {rootSiblings?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {rootNode && <EntityNodeCard node={rootNode} />}
                {rootSpouses?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {childNodes?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
              </div>
            </NodesContainer>
          </Center>
        )}
      </TransformComponent>
      <Navigation {...props} />
    </ThemedGraph>
  );
}

const ThemedGraph = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.graphBackgroundColor};
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  //transform: translate(-50%, -50%); //not freaking working for some reason?!
`;

const RelsContainer = styled.svg`
  position: absolute;
`;

const NodesContainer = styled.div`
  position: absolute;
`;
