import React, { useEffect } from "react";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import Div100vh from "react-div-100vh";
import DrawingArea from "geni/components/DrawingArea";
import Error from "next/error";
import Footer from "layout/Footer";
import Head from "next/head";
import Header from "layout/Header";
import { LANGS } from "constants/langs";
import { LangCode } from "types/Lang";
import { SITE_NAME } from "constants/meta";
import SearchBar from "geni/layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import { isItemId } from "helpers/isItemId";
import { loadEntity } from "geni/treeHelpers/loadEntity";
import pluralize from "pluralize";
import { setSetting } from "store/settingsSlice";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const TreePage = ({
  errorCode,
  ogDescription,
  ogImage,
  ogTitle,
  twitterCard,
  twitterDescription,
  twitterImage,
  twitterTitle,
  langCode,
}) => {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);

  const dispatch = useDispatch();
  // force settings to be as url, otherwise you get a mix up
  useEffect(() => {
    dispatch(setSetting({ languageCode: langCode, wikibaseAlias: "geni" }));
  }, []);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
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
        {ogDescription && <meta name="description" content={ogDescription} />}
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

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };
    console.log("lang found");
    const decodedPropSlug = decodeURIComponent(propSlug);
    const currentProp = "family_tree";

    let itemId;
    let itemThumbnail;
    if (true) {
      //check if id is correct
      itemId = itemSlug;
    } else {
      return { props: { errorCode: 404, message: "Slug must be a QID" } };
    }
    console.log("slug found");

    // try {
    const { currentEntity } = await loadEntity({
      itemId,
      wikibaseAlias: "geni",
      langCode,
      // propSlug: decodedPropSlug,
    });

    if (!currentEntity) return { props: { errorCode: 405 } };

    dispatch(setCurrentEntity(currentEntity));
    // if (itemProps) dispatch(setCurrentEntityProps(itemProps));
    // if (currentProp) dispatch(setCurrentProp(currentProp));

    const ogTitle = `${currentEntity.label} - ${SITE_NAME}`;

    //Example: Discover the family tree of Elizabeth II: queen of the UK, Canada, Australia, and New Zealand, and head of the Commonwealth of Nations, 4 children, 1 sibling, 1 spouse
    const ogDescription = "bla";

    let ogImage = "";
    let twitterCard = "";

    if (itemThumbnail) {
      ogImage = itemThumbnail;
    } else {
      ogImage = "icons/entitree_square.png";
      twitterCard = "summary";
    }

    return {
      props: { ogTitle, ogImage, twitterCard, ogDescription, langCode },
    };
    // } catch (error: any) {
    //   console.error(error);

    //   return { props: { errorCode: error.response?.status || 500 } };
    // }
  },
);

export default TreePage;