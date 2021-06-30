import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import Div100vh from "react-div-100vh";
import DrawingArea from "components/DrawingArea";
import Error from "next/error";
import Footer from "layout/Footer";
import Head from "next/head";
import Header from "layout/Header";
import { LANG_MAP } from "constants/langs";
import { LangCode } from "types/Lang";
import React from "react";
import { SITE_NAME } from "constants/meta";
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import fs from "fs";
import getConfig from "next/config";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import { isItemId } from "helpers/isItemId";
import { loadEntity } from "treeHelpers/loadEntity";
import path from "path";
import { setLangCode } from "store/settingsSlice";
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
  const { currentEntity, currentProp, loadingEntity } = useAppSelector(
    ({ tree }) => tree,
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
        {loadingEntity ? <TreeLoader /> : <DrawingArea />}
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
  async ({ store: { dispatch }, query }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    if (!LANG_MAP[langCode]) return { props: { errorCode: 404 } };

    // force settings to be as url, otherwise you get a mix up
    // TODO: THIS IS NOT WORKING, check redux dev tools it's not setting the lang
    // eve tho it comes after the persistence
    dispatch(setLangCode(langCode));

    const decodedPropSlug = decodeURIComponent(propSlug);
    const decodedItemSlug = decodeURIComponent(itemSlug);

    let itemId;
    let itemThumbnail;
    if (isItemId(itemSlug)) {
      itemId = itemSlug;
    } else {
      try {
        //TODO: cache this
        const {
          data: { wikibase_item, thumbnail },
        } = await getWikipediaArticle(decodedItemSlug, langCode);
        if (wikibase_item) itemId = wikibase_item;
        if (thumbnail) itemThumbnail = thumbnail.source;
      } catch (error) {
        console.error(error);
        return { props: { errorCode: error.response?.status || 500 } };
      }
    }

    try {
      const { currentEntity, currentProp } = await loadEntity({
        itemId,
        langCode,
        propSlug: decodedPropSlug,
        dispatch,
      });

      // TODO: Extract loadEntity here and put the redirects when needed to fetch less data
      if (!currentEntity) return { props: { errorCode: 404 } };

      // redirect all => family_tree or
      if (currentProp && currentProp?.slug !== propSlug) {
        return {
          redirect: {
            destination: `/${langCode}/${currentProp?.slug}/${itemSlug}`,
          },
        };
      }

      //family_tree => all if not found
      if (propSlug !== DEFAULT_PROPERTY_ALL && !currentProp) {
        return {
          redirect: {
            destination: `/${langCode}/${DEFAULT_PROPERTY_ALL}/${itemSlug}`,
          },
        };
      }

      const featuredImageFile = path.join(
        "/screenshot",
        decodedPropSlug,
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
