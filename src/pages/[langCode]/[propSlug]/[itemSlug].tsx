import React, { useEffect } from "react";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
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
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import VideoPopup from "../../../layout/VideoPopup";
import { createMetaTags } from "helpers/createMetaTags";
import { getGeniCookies } from "helpers/cookie";
import getItemIdFromSlug from "wikidata/getItemIdFromSlug";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import isInIframe from "lib/isInIframe";
import { isItemId } from "helpers/isItemId";
import { loadEntity } from "treeHelpers/loadEntity";
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
    dispatch(setSetting({ languageCode: langCode, wikibaseAlias: "wikidata" }));
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
        {!isInIframe() && <Header />}
        {!isInIframe() && <SearchBar />}
        {loadingEntity ? <TreeLoader /> : <DrawingArea />}
        <VideoPopup />
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
  async ({ store: { dispatch }, query, req }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    const geniCookie = getGeniCookies(req);

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };

    const decodedPropSlug = decodeURIComponent(propSlug);
    const decodedItemSlug = decodeURIComponent(itemSlug);

    let itemId = "";
    let itemThumbnail = "";
    if (isItemId(itemSlug)) {
      itemId = itemSlug;
    } else if (itemSlug.substr(0, 3) === "G60") {
      itemId = itemSlug;
    } else {
      try {
        //TODO: cache this
        const {
          data: {
            wikibase_item,
            thumbnail,
            titles: { canonical },
          },
        } = await getWikipediaArticle(decodedItemSlug, langCode);

        //the wikipedia article redirects to another article
        if (canonical !== itemSlug) {
          //try to get the item from wikidata and avoid the redirects
          itemId = await getItemIdFromSlug(decodedItemSlug, langCode);
          if (!itemId) {
            // ok, not found, redirect to page then
            return {
              redirect: {
                destination: `/${langCode}/${propSlug}/${canonical}`,
              },
            };
          }
          // losing itemThumbnail feature for those isolated cases
        } else {
          if (wikibase_item) itemId = wikibase_item;
          if (thumbnail) itemThumbnail = thumbnail.source;
        }
      } catch (error: any) {
        console.error(error);
        return { props: { errorCode: error.response?.status || 500 } };
      }
    }

    //itemId might STILL not be found
    if (!itemId) return { props: { errorCode: 404 } };

    try {
      const { currentEntity, currentProp, itemProps } = await loadEntity({
        itemId,
        wikibaseAlias: "wikidata",
        langCode,
        propSlug: decodedPropSlug,
        geniAccessToken: geniCookie?.access_token,
      });

      // TODO: Extract loadEntity here and put the redirects when needed to fetch less data
      if (!currentEntity) return { props: { errorCode: 404 } };

      // redirect prop "all" to "family_tree"
      if (currentProp && currentProp?.slug !== propSlug) {
        return {
          redirect: {
            destination: `/${langCode}/${currentProp?.slug}/${itemSlug}`,
          },
        };
      }

      // redirect prop "family_tree" to "all" if not found
      if (propSlug !== DEFAULT_PROPERTY_ALL && !currentProp) {
        return {
          redirect: {
            destination: `/${langCode}/${DEFAULT_PROPERTY_ALL}/${itemSlug}`,
          },
        };
      }

      dispatch(setCurrentEntity(currentEntity));
      if (itemProps) dispatch(setCurrentEntityProps(itemProps));
      if (currentProp) dispatch(setCurrentProp(currentProp));

      const { ogDescription, ogTitle } = createMetaTags(
        langCode,
        currentEntity,
        currentProp,
      );

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
    } catch (error: any) {
      console.error(error);

      return { props: { errorCode: error.response?.status || 500 } };
    }
  },
);

export default TreePage;
