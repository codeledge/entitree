import { resetFit, setSizes } from "store/treeSlice";
import styled, { useTheme } from "styled-components";
import { useEffect, useMemo, useState } from "react";

import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import { EntityRel } from "types/EntityRel";
import Rel from "components/Rel";
import { TransformComponent } from "react-zoom-pan-pinch";
import { fromMap } from "entitree-flex";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function Graph({
  setTransform,
  drawingWidth,
  drawingHeight,
}: any) {
  const { currentEntity, entitiesMap, width, height, fit } = useAppSelector(
    ({ tree }) => tree,
  );

  const theme = useTheme();
  const dispatch = useDispatch();

  const [nodes, setNodes] = useState<EntityNode[]>([]);
  const [rels, setRels] = useState<EntityRel[]>([]);

  useEffect(() => {
    if (currentEntity && entitiesMap) {
      const {
        map,
        nodes,
        rels,
        maxRight,
        maxLeft,
        maxBottom,
        maxTop,
      } = fromMap<Entity>(currentEntity.treeId, entitiesMap, {
        clone: true,
        nodeWidth: theme.nodeWidth,
        nodeHeight: theme.nodeHeight,
        verticalSpacing: theme.nodeVerticalSpacing,
        siblingSpacing: theme.separationSameGroup,
        cousinSpacing: theme.separationCousins,
        childrenAccessor: "childrenTreeIds",
        parentsAccessor: "parentsTreeIds",
        siblingsAccessor: "siblingsTreeIds",
        partnersAccessor: "spousesTreeIds",
      });

      //console.log({ nodes, rels, maxRight, maxLeft, maxBottom, maxTop });

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
      setNodes(nodes);
      setRels(rels);

      if (fit && map) {
        dispatch(resetFit());

        const halfWidth = drawingWidth / 2;
        const halfHeight = drawingHeight / 2;

        let actualWidth = drawingWidth;
        let centerX;

        if (fit.leftEntityTreeId && fit.rightEntityTreeId) {
          const rightNode = map[fit.rightEntityTreeId];
          const leftNode = map[fit.leftEntityTreeId];

          const fitRight = rightNode.x + theme.nodeWidth;
          const fitLeft = leftNode.x - theme.nodeWidth;
          actualWidth = fitRight - fitLeft;
          centerX = fitLeft + actualWidth / 2;
        }

        let actualHeight = drawingHeight;
        let centerY;
        if (fit.topEntityTreeId && fit.bottomEntityTreeId) {
          const bottomNode = map[fit.bottomEntityTreeId];
          const topNode = map[fit.topEntityTreeId];
          const fitBottom = bottomNode.y;
          const fitTop = topNode.y;
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
    }
  }, [currentEntity, entitiesMap]);

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
                {rels?.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
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
                {nodes?.map((node) => (
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
