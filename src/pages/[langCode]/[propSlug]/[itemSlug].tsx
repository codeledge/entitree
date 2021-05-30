import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
  setCurrentUpMap,
  setPreloadedChildren,
  setPreloadedParents,
} from "store/navigationSlice";
import { sortByBirthDate, sortByGender } from "lib/sortEntities";
import { useAppSelector, wrapper } from "store";

import { CHILD_ID } from "constants/properties";
import Div100vh from "react-div-100vh";
import DrawingArea from "components/DrawingArea";
import Error from "next/error";
import Footer from "layout/Footer";
import Head from "next/head";
import Header from "layout/Header";
import { LangCode } from "types/Lang";
import React from "react";
import { SITE_NAME } from "constants/meta";
import SearchBar from "layout/SearchBar";
import fs from "fs";
import getConfig from "next/config";
import getEntities from "lib/getEntities";
import getItemProps from "wikidata/getItemProps";
import getUpMap from "wikidata/getUpMap";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import path from "path";
import styled from "styled-components";

const TreePage = ({
  errorCode,
  ogDescription,
  ogImage,
  ogTitle,
  twitterCard,
  twitterDescription,
  twitterImage,
  twitterTitle,
}) => {
  const { currentEntity, currentProp } = useAppSelector(
    ({ navigation }) => navigation,
  );

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

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
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogDescription && (
          <meta property="og:description" content={ogDescription} />
        )}
        {twitterDescription && (
          <meta property="twitter:description" content={twitterDescription} />
        )}
        {twitterCard && <meta property="twitter:card" content={twitterCard} />}
        {twitterTitle && (
          <meta property="twitter:title" content={twitterTitle} />
        )}
        {twitterImage && (
          <meta property="twitter:image" content={twitterImage} />
        )}
        {currentEntity?.description && (
          <meta name="description" content={currentEntity?.description} />
        )}
      </Head>
      <Page>
        <Header />
        <SearchBar />
        <DrawingArea />
      </Page>
      <Footer />
    </>
  );
};

const Page = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`;

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, query }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    let itemId;
    let itemThumbnail;
    if (itemSlug.match(/^Q\d+$/)) {
      itemId = itemSlug;
    } else {
      try {
        const {
          data: {
            wikibase_item,
            thumbnail: { source },
          },
        } = await getWikipediaArticle(itemSlug, langCode);
        if (wikibase_item) itemId = wikibase_item;
        if (source) itemThumbnail = source;
      } catch (error) {
        return { props: { errorCode: error.response.status } };
      }
    }

    try {
      const itemProps = await getItemProps(itemId, langCode);
      const currentProp = itemProps.find(({ slug }) => slug === propSlug);
      const [[currentEntity], upMap] = await Promise.all([
        getEntities([itemId], langCode, {
          currentPropId: currentProp?.id,
          addDownIds: true,
          addLeftIds: true,
          addRightIds: true,
        }),
        ...(currentProp ? [getUpMap(itemId, currentProp.id)] : []),
      ]);

      const [preloadedChildren, preloadedParents] = await Promise.all([
        getEntities(currentEntity.downIds!, langCode, {
          currentPropId: currentProp?.id,
          addDownIds: true,
          addRightIds: currentProp?.id === CHILD_ID,
        }),
        getEntities(upMap[currentEntity.id], langCode, {
          currentPropId: currentProp?.id,
          upMap,
          addLeftIds: currentProp?.id === CHILD_ID,
          addRightIds: currentProp?.id === CHILD_ID,
        }),
      ]);
      if (currentProp?.id === CHILD_ID && !currentEntity.downIdsAlreadySorted) {
        sortByBirthDate(preloadedChildren);
      }
      if (currentProp?.id === CHILD_ID) {
        sortByGender(preloadedParents);
      }

      store.dispatch(setCurrentEntity(currentEntity));
      store.dispatch(setCurrentEntityProps(itemProps));
      if (preloadedChildren)
        store.dispatch(setPreloadedChildren(preloadedChildren));
      if (preloadedParents)
        store.dispatch(setPreloadedParents(preloadedParents));
      if (upMap) store.dispatch(setCurrentUpMap(upMap));
      if (currentProp) store.dispatch(setCurrentProp(currentProp));

      const featuredImageFile = path.join(
        "/screenshot",
        propSlug,
        itemSlug + ".png",
      );

      const ogTitle = currentEntity.label;
      let ogImage = "";
      let twitterCard = "";

      if (
        fs.existsSync(
          path.join(
            getConfig().serverRuntimeConfig.PROJECT_ROOT,
            `public`,
            featuredImageFile,
          ),
        )
      ) {
        ogImage = featuredImageFile;
      } else if (itemThumbnail) {
        ogImage = itemThumbnail;
      } else {
        ogImage = "icons/entitree_square.png";
        twitterCard = "summary";
      }

      return { props: { ogTitle, ogImage, twitterCard } };
    } catch (error) {
      console.error(error);

      return { props: { errorCode: error.response?.status || 500 } };
    }
  },
);

export default TreePage;
