import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
import { setLangCode, setSetting } from "store/settingsSlice";
import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import Div100vh from "react-div-100vh";
import DrawingArea from "components/DrawingArea";
import Error from "next/error";
import Footer from "layout/Footer";
import Head from "next/head";
import Header from "layout/Header";
import { LANGS } from "constants/langs";
import { LangCode } from "types/Lang";
import React from "react";
import { SITE_NAME } from "constants/meta";
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import { isItemId } from "helpers/isItemId";
import { loadEntity } from "treeHelpers/loadEntity";
import pluralize from "pluralize";
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
}) => {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);

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
    dispatch(setSetting({ key: "wikibase", val: "factgrid" }));

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };

    const decodedPropSlug = decodeURIComponent(propSlug);
    const decodedItemSlug = decodeURIComponent(itemSlug);

    let itemId;
    let itemThumbnail;
    if (isItemId(itemSlug)) {
      itemId = itemSlug;
    } else {
      //error
    }

    try {
      const { currentEntity, currentProp, itemProps } = await loadEntity({
        itemId,
        wikibase: "factgrid",
        langCode,
        propSlug: decodedPropSlug,
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

      // force settings to be as url, otherwise you get a mix up
      // TODO: THIS IS NOT WORKING, check redux dev tools it's not setting the lang
      // eve tho it comes after the persistence
      dispatch(setLangCode(langCode));
      dispatch(setCurrentEntity(currentEntity));
      if (itemProps) dispatch(setCurrentEntityProps(itemProps));
      if (currentProp) dispatch(setCurrentProp(currentProp));

      // const featuredImageFile = path.join(
      //   "/screenshot",
      //   decodedPropSlug,
      //   itemSlug + ".png",
      // );

      const ogTitle = `${currentEntity.label}${
        currentProp
          ? ` - ${currentProp.overrideLabel || currentProp.label}`
          : ""
      } - ${SITE_NAME}`;

      //Example: Discover the family tree of Elizabeth II: queen of the UK, Canada, Australia, and New Zealand, and head of the Commonwealth of Nations, 4 children, 1 sibling, 1 spouse
      const ogDescription = `${
        currentProp
          ? `Discover the ${
              currentProp?.overrideLabel || currentProp?.label
            } of ${currentEntity.label}: `
          : ""
      }${currentEntity?.description}${
        currentEntity.downIds?.length
          ? `, ${pluralize("child", currentEntity.downIds.length, true)}`
          : ""
      }${
        currentEntity.leftIds?.length
          ? `, ${pluralize("sibling", currentEntity.leftIds.length, true)}`
          : ""
      }${
        currentEntity.spousesIds?.length
          ? `, ${pluralize("spouse", currentEntity.spousesIds.length, true)}`
          : ""
      }${
        currentEntity.partnersIds?.length
          ? `, ${pluralize("partner", currentEntity.partnersIds.length, true)}`
          : ""
      }`;

      let ogImage = "";
      let twitterCard = "";

      // if (
      //   fs.existsSync(
      //     path.join(
      //       getConfig().serverRuntimeConfig.PROJECT_ROOT,
      //       `public`,
      //       featuredImageFile,
      //     ),
      //   )
      // ) {
      //   ogImage = featuredImageFile;
      // } else
      if (itemThumbnail) {
        ogImage = itemThumbnail;
      } else {
        ogImage = "icons/entitree_square.png";
        twitterCard = "summary";
      }

      return { props: { ogTitle, ogImage, twitterCard, ogDescription } };
    } catch (error: any) {
      console.error(error);

      return { props: { errorCode: error.response?.status || 500 } };
    }
  },
);

export default TreePage;