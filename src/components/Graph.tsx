import { resetFit, setSizes } from "store/treeSlice";
import styled, { useTheme } from "styled-components";
import { useEffect, useMemo, useState } from "react";

import { Entity } from "types/Entity";
import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import { EntityRel } from "types/EntityRel";
import Rel from "components/Rel";
import { TransformComponent } from "react-zoom-pan-pinch";
import fitEdges from "treeHelpers/fitEdges";
import { layoutFromMap } from "entitree-flex";
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
  const { followNavigation, orientation } = useAppSelector(
    ({ settings }) => settings,
  );

  const theme = useTheme();
  const dispatch = useDispatch();

  const [nodes, setNodes] = useState<EntityNode[]>([]);
  const [rels, setRels] = useState<EntityRel[]>([]);

  useEffect(() => {
    if (currentEntity?.treeId && entitiesMap) {
      const { map, nodes, rels, maxRight, maxLeft, maxBottom, maxTop } =
        layoutFromMap<Entity>(currentEntity.treeId, entitiesMap, {
          clone: true,
          secondDegreeSpacing: theme.separationCousins,
          firstDegreeSpacing: theme.separationSameGroup,
          nextAfterAccessor: "openSpouseTreeIds",
          nextAfterSpacing: theme.separationSiblingSpouse,
          nextBeforeAccessor: "openSiblingTreeIds",
          nextBeforeSpacing: theme.separationSiblingSpouse,
          nodeHeight: theme.nodeHeight,
          nodeWidth: theme.nodeWidth,
          sourcesAccessor: "openParentTreeIds",
          sourceTargetSpacing: theme.separationVertical,
          targetsAccessor: "openChildTreeIds",
          orientation,
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

      //Todo move this into its own useEffect
      if (fit && map && followNavigation) {
        dispatch(resetFit());

        const rightNode = map[fit.rightEntityTreeId!];
        const leftNode = map[fit.leftEntityTreeId!];
        const bottomNode = map[fit.bottomEntityTreeId!];
        const topNode = map[fit.topEntityTreeId!];

        // should divide by 2 for perfect fit because of the node translation (centering on x/y point), but leave some space
        const rightX = rightNode.x + theme.nodeWidth;
        const leftX = leftNode.x - theme.nodeWidth;
        const bottomY = bottomNode.y + theme.nodeHeight;
        const topY = topNode.y - theme.nodeHeight;

        fitEdges({
          drawingWidth,
          drawingHeight,
          rightX,
          leftX,
          bottomY,
          topY,
          setTransform,
        });
      }
    }
  }, [currentEntity, entitiesMap, theme, orientation]);

  const containerStyle = useMemo(() => ({ width, height }), [width, height]);
  const cssCenterTransformStyle = useMemo(
    () => ({
      transform: `translate(-${width / 2}px, -${height / 2}px)`,
    }),
    [width, height],
  );
  const centerTransformProp = useMemo(
    () => `translate(${width / 2} ${height / 2})`,
    [width, height],
  );

  return (
    <ThemedGraph>
      <TransformComponent>
        {!!width && !!height && (
          <Center style={cssCenterTransformStyle}>
            <RelsContainer style={containerStyle}>
              <g transform={centerTransformProp}>
                {rels?.map((rel) => (
                  <Rel
                    key={rel.source.treeId! + rel.target.treeId!}
                    rel={rel}
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
                {nodes?.map((node) => (
                  <EntityNodeCard key={node.treeId!} node={node} />
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
`;

const RelsContainer = styled.svg`
  position: absolute;
`;

const NodesContainer = styled.div`
  position: absolute;
`;
