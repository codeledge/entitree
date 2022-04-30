import { useEffect } from "react";
import { getWikipediaArticle, isItemId } from "@entitree/helper";
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
import { PageProps } from "types/PageProps";
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import { createMetaTags } from "seo/createMetaTags";
import { getCurrentEntity } from "treeHelpers/getCurrentEntity";
import getEntityIdFromSlug from "wikidata/getEntityIdFromSlug";
import isInIframe from "lib/isInIframe";
import { setSetting } from "store/settingsSlice";
import { useDispatch } from "react-redux";
import NoSsr from "layout/NoSsr";

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
}: PageProps) => {
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
        {!isInIframe() && (
          <NoSsr>
            <Header />
          </NoSsr>
        )}
        {!isInIframe() && (
          <NoSsr>
            <SearchBar />
          </NoSsr>
        )}
        {loadingEntity ? <TreeLoader /> : <DrawingArea />}
      </Page>
      {!isInIframe() && (
        <NoSsr>
          <Footer />
        </NoSsr>
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps<PageProps>(
  ({ dispatch }) =>
    async ({ query }) => {
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
            wikibase_item,
            thumbnail,
            titles: { canonical },
          } = await getWikipediaArticle(decodedItemSlug, langCode);

          //the wikipedia article redirects to another article
          if (canonical !== itemSlug) {
            //try to get the item from wikidata and avoid the redirects
            entityId = await getEntityIdFromSlug(decodedItemSlug, langCode);
            if (!entityId) {
              // ok, not found, redirect to page then
              return {
                redirect: {
                  destination: `/${langCode}/${encodeURIComponent(
                    propSlug,
                  )}/${encodeURIComponent(canonical)}`,
                  permanent: false,
                },
              };
            }
            // losing entityThumbnail feature for those isolated cases
          } else {
            if (wikibase_item) entityId = wikibase_item;
            if (thumbnail) entityThumbnail = thumbnail.source;
          }
        } catch (error: any) {
          console.error(error); // eslint-disable-line no-console
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

        // redirect prop "all" (or anything not found) to "family_tree" (or the relative translation)
        if (currentProp && currentProp?.slug !== propSlug) {
          return {
            redirect: {
              destination: `/${langCode}/${encodeURIComponent(
                currentProp?.slug,
              )}/${itemSlug}`,
              permanent: false,
            },
          };
        }

        // redirect prop "family_tree" to "all" if not found
        if (propSlug !== DEFAULT_PROPERTY_ALL && !currentProp) {
          return {
            redirect: {
              destination: `/${langCode}/${DEFAULT_PROPERTY_ALL}/${itemSlug}`,
              permanent: false,
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
        console.error(error); // eslint-disable-line no-console

        return { props: { errorCode: error.response?.status || 500 } };
      }
    },
);

export default TreePage;
