import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  setInitialTree,
  setNodeSiblings,
  toggleChildren,
  toggleParents,
} from "store/treeSlice";
import styled, { useTheme } from "styled-components";

import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import getNodeUniqueId from "lib/getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { showError } from "store/alertSlice";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Graph() {
  const settings = useAppSelector(({ settings: s }) => s);
  const { root, childTree, parentTree } = useAppSelector(({ tree }) => tree);
  const { currentEntity, currentProp } = useAppSelector(
    ({ navigation }) => navigation,
  );

  const dispatch = useDispatch();
  const theme = useTheme();

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

            const parentTree = hierarchy(currentEntity) as EntityNode;
            parentTree.treeId = rootId;
            parentTree.isRoot = true;
            parentTree.x = 0;
            parentTree.y = 0;
            dispatch(setInitialTree({ root, childTree, parentTree }));
          } else {
            //currentEntity has changed from searchBox

            dispatch(setInitialTree({ root }));
          }
        } catch (error) {
          showError(error);
        }
      })();
    }
  }, [currentEntity, currentProp]);
  return (
    <GraphWrapper>
      <TransformWrapper
        zoomIn={{ step: 20 }}
        zoomOut={{ step: 20 }}
        wheel={{ step: 25 }}
        options={{
          limitToBounds: false,
        }}
      >
        {(props) => (
          <TransformComponent>
            <Center>
              <NodesContainer>
                {root && <EntityNodeCard node={root} />}
              </NodesContainer>
            </Center>
          </TransformComponent>
        )}
      </TransformWrapper>
    </GraphWrapper>
  );
}

const GraphWrapper = styled.div`
  position: relative;
  flex: 1;
  .react-transform-component,
  .react-transform-element {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const RelsContainer = styled.svg`
  position: absolute;
`;

const NodesContainer = styled.div`
  position: absolute;
`;
