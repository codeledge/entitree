import React, { useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setLoadingEntity,
} from "store/navigationSlice";
import {
  setInitialTree,
  setNodeSiblings,
  toggleChildren,
  toggleParents,
} from "store/treeSlice";
import styled, { useTheme } from "styled-components";
import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import Div100vh from "react-div-100vh";
import { EntityNode } from "types/EntityNode";
import EntityNodeCard from "components/EntityNodeCard";
import Error from "next/error";
import Head from "next/head";
import Header from "layout/Header";
import { LangCode } from "types/Lang";
import { PropsList } from "react-zoom-pan-pinch/dist/store/interfaces/propsInterface";
import { SITE_NAME } from "constants/meta";
import SearchBar from "layout/SearchBar";
import getConfig from "next/config";
import getEntities from "lib/getEntities";
import getItemProps from "wikidata/getItemProps";
import getNodeUniqueId from "lib/getNodeUniqueId";
import getUpMap from "wikidata/getUpMap";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import { hierarchy } from "d3-hierarchy";
import path from "path";
import { showError } from "store/alertSlice";
import { useDispatch } from "react-redux";

const TreePage = ({ errorCode, ogTitle, ogImage }) => {
  const { currentEntity, currentProp } = useAppSelector(
    ({ navigation }) => navigation,
  );
  const settings = useAppSelector(({ settings: s }) => s);
  const { root, childTree, parentTree } = useAppSelector(({ tree }) => tree);

  const dispatch = useDispatch();
  const theme = useTheme();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

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
    <>
      <Head>
        <title>
          {currentEntity?.label}
          {currentProp
            ? ` - ${currentProp.overrideLabel || currentProp.label}`
            : ""}{" "}
          - {SITE_NAME}
        </title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:image" content={ogImage} />

        {currentEntity?.description && (
          <meta name="description" content={currentEntity?.description} />
        )}
      </Head>
      <Page>
        <Header />
        <SearchBar />
        <GraphWrapper>
          <TransformWrapper
            zoomIn={{ step: 20 }}
            zoomOut={{ step: 20 }}
            wheel={{ step: 25 }}
            options={{
              limitToBounds: false,
            }}
          >
            {(props: PropsList) => (
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
      </Page>
    </>
  );
};

const Page = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`;

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

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, query }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    let itemId;
    if (itemSlug.match(/^Q\d+$/)) {
      itemId = itemSlug;
    } else {
      try {
        const {
          data: { wikibase_item },
        } = await getWikipediaArticle(itemSlug, langCode);
        if (wikibase_item) itemId = wikibase_item;
      } catch (error) {
        console.error(error);

        return { props: { errorCode: error.response.status } };
      }
    }

    try {
      const [[currentEntity], itemProps] = await Promise.all([
        getEntities([itemId], langCode),
        getItemProps(itemId, langCode),
      ]);

      store.dispatch(setCurrentEntity(currentEntity));
      store.dispatch(setCurrentEntityProps(itemProps));
      const currentProp = itemProps.find(({ slug }) => slug === propSlug);
      if (currentProp) store.dispatch(setCurrentProp(currentProp));

      const featuredImageFile = path.join(
        "screenshot",
        propSlug,
        itemSlug + ".png",
      );

      const ogTitle = currentEntity.label;
      let ogImage;
      let twitterCard;
      console.log(getConfig().serverRuntimeConfig.PROJECT_ROOT);

      //     if (fs.existsSync(
      //   path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, staticFilePath),
      // );) {
      //       ogImage = featuredImageFile;
      //     } else {
      //       ogImage = "icons/entitree_square.png";
      //       twitterCard = "summary";
      //     }

      return { props: { ogTitle } };
    } catch (error) {
      console.error(error);

      return { props: { errorCode: error.response.status } };
    }
  },
);

export default TreePage;
