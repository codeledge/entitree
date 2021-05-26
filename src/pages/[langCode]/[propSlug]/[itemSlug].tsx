import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/navigationSlice";
import { useAppSelector, wrapper } from "store";

import Div100vh from "react-div-100vh";
import Error from "next/error";
import Footer from "layout/Footer";
import Graph from "components/Graph";
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
        <Graph />
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

      if (
        fs.existsSync(
          path.join(
            getConfig().serverRuntimeConfig.PROJECT_ROOT,
            "public",
            featuredImageFile,
          ),
        )
      ) {
        ogImage = featuredImageFile;
      } else {
        ogImage = "icons/entitree_square.png";
        twitterCard = "summary";
      }

      return { props: { ogTitle, ogImage, twitterCard } };
    } catch (error) {
      console.error(error);

      return { props: { errorCode: error.response.status } };
    }
  },
);

export default TreePage;
