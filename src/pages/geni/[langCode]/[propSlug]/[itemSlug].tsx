import React, { useEffect } from "react";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
import { useAppSelector, wrapper } from "store";

import DrawingArea from "components/DrawingArea";
import Error from "next/error";
import { FAMILY_TREE_PROP } from "constants/properties";
import Footer from "layout/Footer";
import { HeadMeta } from "layout/HeadMeta";
import Header from "layout/Header";
import { LANGS } from "constants/langs";
import { LangCode } from "types/Lang";
import { Page } from "layout/Page";
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import { createMetaTags } from "seo/createMetaTags";
import { getCurrentEntity } from "treeHelpers/getCurrentEntity";
import getEntityIdFromSlug from "wikidata/getEntityIdFromSlug";
import { getGeniCookies } from "helpers/cookies";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import isInIframe from "lib/isInIframe";
import { setSetting } from "store/settingsSlice";
import { useDispatch } from "react-redux";

const GeniTreePage = ({
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
    dispatch(setSetting({ languageCode: langCode, dataSource: "geni" }));
  }, []);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <HeadMeta
        ogDescription={ogDescription}
        ogImage={ogImage}
        ogTitle={ogTitle}
        twitterCard={twitterCard}
        twitterDescription={twitterDescription}
        twitterImage={twitterImage}
        twitterTitle={twitterTitle}
      />
      <Page>
        {!isInIframe() && <Header />}
        {!isInIframe() && <SearchBar />}
        {loadingEntity ? <TreeLoader /> : <DrawingArea />}
      </Page>
      <Footer />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store: { dispatch }, query, req }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    const geniCookie = getGeniCookies(req);
    console.log(geniCookie);
    if (!geniCookie?.access_token) {
      return {
        redirect: {
          destination: "/geni",
          permanent: false,
        },
      };
    }

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };

    const decodedPropSlug = decodeURIComponent(propSlug);

    const currentProp = FAMILY_TREE_PROP;

    let itemId;
    let itemThumbnail;
    if (itemSlug === "me") {
      itemId = "";
    } else if (itemSlug) {
      //check if id is correct
      itemId = itemSlug;
    } else {
      return { props: { errorCode: 404, message: "ID not found" } };
    }

    const { currentEntity } = { currentEntity: {} };

    if (!currentEntity) return { props: { errorCode: 404 } };

    // const { ogDescription, ogTitle } = createMetaTags(
    //   langCode,
    //   currentEntity,
    //   currentProp,
    // );

    let ogImage = "";
    let twitterCard = "";

    ogImage = "icons/entitree_square.png";
    twitterCard = "summary";

    return {
      props: {}, //{ ogTitle, ogImage, twitterCard, ogDescription, langCode },
    };
  },
);

export default GeniTreePage;
