import React, { useEffect } from "react";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import DrawingArea from "components/DrawingArea";
import Error from "next/error";
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
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import isInIframe from "lib/isInIframe";
import { isItemId } from "helpers/isItemId";
import { setSetting } from "store/settingsSlice";
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
    dispatch(setSetting({ languageCode: langCode, dataSource: "wikidata" }));
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
  async ({ store: { dispatch }, query }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };

    const decodedPropSlug = decodeURIComponent(propSlug);
    const decodedItemSlug = decodeURIComponent(itemSlug);

    let entityId = "";
    let entityThumbnail = "";
    if (isItemId(itemSlug)) {
      entityId = itemSlug;
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
          entityId = await getEntityIdFromSlug(decodedItemSlug, langCode);
          if (!entityId) {
            // ok, not found, redirect to page then
            return {
              redirect: {
                destination: `/${langCode}/${propSlug}/${canonical}`,
              },
            };
          }
          // losing entityThumbnail feature for those isolated cases
        } else {
          if (wikibase_item) entityId = wikibase_item;
          if (thumbnail) entityThumbnail = thumbnail.source;
        }
      } catch (error: any) {
        console.error(error);
        return { props: { errorCode: error.response?.status || 500 } };
      }
    }

    //entityId might STILL not be found
    if (!entityId) return { props: { errorCode: 404 } };

    try {
      const { currentEntity, currentProp, currentEntityProps } =
        await getCurrentEntity({
          entityId,
          dataSource: "wikidata",
          langCode,
          propSlug: decodedPropSlug,
        });

      // TODO: Extract getCurrentEntity here and put the redirects when needed to fetch less data
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
      if (currentEntityProps)
        dispatch(setCurrentEntityProps(currentEntityProps));
      if (currentProp) dispatch(setCurrentProp(currentProp));

      const { ogDescription, ogTitle } = createMetaTags(
        langCode,
        currentEntity,
        currentProp,
      );

      let ogImage = "";
      let twitterCard = "";

      if (entityThumbnail) {
        ogImage = entityThumbnail;
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
