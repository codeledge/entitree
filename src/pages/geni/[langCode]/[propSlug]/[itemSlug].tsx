import React, { useEffect } from "react";
import { getGeniImmediateFamily, getGeniProfiles } from "services/geniService";
import { setCurrentEntity, setCurrentProp } from "store/treeSlice";
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
import { addGeniEntityConnectors } from "lib/geni/addGeniEntityConnectors";
import { createMetaTags } from "seo/createMetaTags";
import { formatGeniProfile } from "lib/formatGeniProfile";
import { getGeniCookies } from "helpers/cookies";
import isInIframe from "lib/isInIframe";
import { setSetting } from "store/settingsSlice";
import { useDispatch } from "react-redux";
import { PageProps } from "types/PageProps";

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
  const dispatch = useDispatch();

  const { loadingEntity } = useAppSelector(({ tree }) => tree);

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

export const getServerSideProps = wrapper.getServerSideProps<PageProps>(
  ({ dispatch }) =>
    async ({ query, req }) => {
      const { langCode, propSlug, itemSlug } = query as {
        langCode: LangCode;
        propSlug: string;
        itemSlug: string;
      };

      const geniCookie = getGeniCookies(req);

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

      let entityId;
      if (itemSlug === "me") {
        entityId = "";
      } else if (itemSlug) {
        //check if id is correct
        entityId = itemSlug.substr(1);
      } else {
        return { props: { errorCode: 404, message: "ID not found" } };
      }

      const geni = getGeniCookies(req);

      // Server-side getRootEntity function
      const [profile] = await getGeniProfiles(entityId, geni.access_token);

      if (!profile) return { props: { errorCode: 404 } };

      const currentEntity = formatGeniProfile(profile);

      currentEntity.treeId = "0";

      // Server-side addConnetions function
      const [immediateFamily] = await getGeniImmediateFamily(
        entityId,
        geni.access_token,
      );

      addGeniEntityConnectors(currentEntity, immediateFamily, {
        addNextAfterIds: true,
        addTargetIds: true,
        addSourceIds: true,
        addNextBeforeIds: true,
      });

      dispatch(setCurrentEntity(currentEntity));
      const currentProp = FAMILY_TREE_PROP;
      dispatch(setCurrentProp(FAMILY_TREE_PROP));

      const { ogDescription, ogTitle } = createMetaTags(
        langCode,
        currentEntity,
        currentProp,
      );

      let ogImage = "";
      let twitterCard = "";

      ogImage = "icons/entitree_square.png";
      twitterCard = "summary";

      return {
        props: { ogTitle, ogImage, twitterCard, ogDescription, langCode },
      };
    },
);

export default GeniTreePage;
