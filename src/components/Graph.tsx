import {
  setInitialTree,
  setNodeSiblings,
  toggleChildren,
  toggleParents,
} from "store/treeSlice";
import styled, { useTheme } from "styled-components";
import { useEffect, useRef } from "react";

import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import Navigation from "components/Navigation";
import Rel from "components/Rel";
import { Theme } from "constants/themes";
import { TransformComponent } from "react-zoom-pan-pinch";
import { addChildEntities } from "lib/addNodeChildren";
import { addParentEntities } from "lib/addNodeParents";
import getNodeUniqueId from "lib/getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { showError } from "store/alertSlice";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import useElementSize from "hooks/useElementSize";

export default function Graph(props) {
  const settings = useAppSelector(({ settings: s }) => s);
  const {
    containerStyle,
    root,
    childRels,
    childNodes,
    parentRels,
    parentNodes,
  } = useAppSelector(({ tree }) => tree);
  const {
    currentEntity,
    currentProp,
    preloadedChildren,
    preloadedParents,
    currentUpMap,
  } = useAppSelector(({ navigation }) => navigation);

  const graphRef = useRef(null);

  const { width, height } = useElementSize(graphRef);

  const dispatch = useDispatch();
  const theme = useTheme() as Theme;

  useEffect(() => {
    //also wait until the container size has been set
    if (currentEntity) {
      (async () => {
        try {
          const root = hierarchy(currentEntity) as EntityNode;
          root.x = 0;
          root.y = 0;
          const rootId = getNodeUniqueId(root, 0);
          root.treeId = rootId;
          root.isRoot = true;

          //property has been selected/changed from dropdown or is available from url
          if (currentProp) {
            //annoyingly a repetition but correct in order to have separate trees
            const childTree = hierarchy(currentEntity) as EntityNode;
            childTree.treeId = rootId;
            childTree.isRoot = true;
            childTree.x = 0;
            childTree.y = 0;

            if (preloadedChildren) {
              addChildEntities(childTree, preloadedChildren);
            }

            const parentTree = hierarchy(currentEntity) as EntityNode;
            parentTree.treeId = rootId;
            parentTree.isRoot = true;
            parentTree.x = 0;
            parentTree.y = 0;

            if (preloadedParents) {
              addParentEntities(parentTree, preloadedParents, currentProp.id);
            }

            dispatch(setInitialTree({ root, childTree, parentTree, theme }));
          } else {
            //currentEntity has changed from searchBox

            dispatch(setInitialTree({ root, theme }));
          }
        } catch (error) {
          console.error(error);
          showError(error);
        }
      })();
    }
  }, [currentEntity, currentProp]);

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
                {parentRels.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
                ))}
                {childRels?.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
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
                {root && <EntityNodeCard node={root} />}
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
