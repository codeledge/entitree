import { resetFit, setSizes } from "store/treeSlice";
import styled, { useTheme } from "styled-components";
import { useEffect, useMemo, useState } from "react";

import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import Rel from "components/Rel";
import { RelData } from "types/RelData";
import { TransformComponent } from "react-zoom-pan-pinch";
import { makeNode } from "treeHelpers/makeNode";
import treeLayout from "lib/getTreeLayout";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function Graph({
  setTransform,
  drawingWidth,
  drawingHeight,
}: any) {
  const {
    currentEntity,
    parentTree,
    childTree,
    width,
    height,
    fit,
  } = useAppSelector(({ tree }) => tree);

  const theme = useTheme();
  const dispatch = useDispatch();

  const [rootNode, setRootNode] = useState<EntityNode>();
  const [childNodes, setChildNodes] = useState<EntityNode[]>([]);
  const [parentNodes, setParentNodes] = useState<EntityNode[]>([]);
  const [rootSiblings, setRootSiblings] = useState<EntityNode[]>();
  const [rootSpouses, setRootSpouses] = useState<EntityNode[]>();
  const [childRels, setChildRels] = useState<RelData[]>();
  const [parentRels, setParentRels] = useState<RelData[]>();

  useEffect(() => {
    if (currentEntity) {
      const rootNode = makeNode(currentEntity);
      rootNode.x = 0;
      rootNode.y = 0;
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
        setChildNodes(childHierarchy.descendants());
        setChildRels(childHierarchy.links() as RelData[]);
      } else {
        setChildNodes([]);
        setChildRels([]);
      }

      if (parentTree) {
        const parentHierarchy = makeNode(parentTree, "parents");
        treeLayout(parentHierarchy);
        setParentNodes(parentHierarchy.descendants());
        setParentRels(parentHierarchy.links() as RelData[]);
      } else {
        setParentNodes([]);
        setParentRels([]);
      }
    }
  }, [currentEntity, childTree, parentTree]);

  const findNode = (entity) => {
    return (
      parentNodes.find((n) => n.data.id === entity.id) ||
      childNodes.find((n) => n.data.id === entity.id) ||
      rootSiblings?.find((n) => n.data.id === entity.id) ||
      rootSpouses?.find((n) => n.data.id === entity.id)
    );
  };

  useEffect(() => {
    calcBounds();
    if (fit) {
      dispatch(resetFit());

      const halfWidth = drawingWidth / 2;
      const halfHeight = drawingHeight / 2;

      let actualWidth = drawingWidth;
      let centerX;
      if (fit.leftEntity && fit.rightEntity) {
        const fitRight = findNode(fit.rightEntity)!.x + theme.nodeWidth;
        const fitLeft = findNode(fit.leftEntity)!.x - theme.nodeWidth;
        actualWidth = fitRight - fitLeft;
        centerX = fitLeft + actualWidth / 2;
      }

      let actualHeight = drawingHeight;
      let centerY;
      if (fit.topEntity && fit.bottomEntity) {
        const fitBottom = findNode(fit.bottomEntity)!.y;
        const fitTop = findNode(fit.topEntity)!.y;
        actualHeight = fitBottom - fitTop;
        centerY = fitTop + actualHeight / 2;
      }

      let nextScale;
      if (actualWidth !== drawingWidth || actualHeight !== drawingHeight) {
        if (drawingWidth - actualWidth < drawingHeight - actualHeight) {
          nextScale = drawingWidth / actualWidth;
        } else {
          nextScale = drawingHeight / actualHeight;
        }
        if (nextScale > 1) nextScale = 1;
      }

      const calculatedPositionX =
        centerX !== undefined
          ? halfWidth - (halfWidth + centerX) * nextScale
          : undefined;

      const calculatedPositionY =
        centerY !== undefined
          ? halfHeight - (halfHeight + centerY) * nextScale
          : undefined;

      setTransform(calculatedPositionX, calculatedPositionY, nextScale);
    }
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

    dispatch(
      setSizes({
        maxRight,
        maxLeft,
        maxBottom,
        maxTop,
        width: 2 * Math.max(Math.abs(maxLeft), maxRight) + theme.nodeWidth,
        height: 2 * Math.max(Math.abs(maxTop), maxBottom) + theme.nodeHeight,
      }),
    );
  };

  const containerStyle = useMemo(() => ({ width, height }), [width, height]);

  return (
    <ThemedGraph>
      <TransformComponent>
        {!!width && !!height && (
          <Center
            style={{
              transform: `translate(-${width / 2}px, -${height / 2}px)`,
            }}
          >
            <RelsContainer style={containerStyle}>
              <g transform={`translate(${width / 2} ${height / 2})`}>
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
                  left: width / 2,
                  top: height / 2,
                }}
              >
                {parentNodes?.slice(1).map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {rootSiblings?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {rootNode && (
                  <EntityNodeCard
                    node={rootNode}
                    childRoot={childNodes[0]}
                    parentRoot={parentNodes[0]}
                  />
                )}
                {rootSpouses?.map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
                {childNodes?.slice(1).map((node) => (
                  <EntityNodeCard key={node.treeId} node={node} />
                ))}
              </div>
            </NodesContainer>
          </Center>
        )}
      </TransformComponent>
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
