import { DataSource, getEntityWikipediaSlug } from "@entitree/helper";
import { Entity, EntityProp } from "types/Entity";

import { AppThunk } from "store";
import { LangCode } from "types/Lang";
import { getEntityUrl } from "helpers/getEntityUrl";
import getWikibaseEntityProps from "wikibase/getWikibaseEntityProps";
import { reset } from "store/treeSlice";
import router from "next/router";

export const switchLanguage =
  (
    langCode: LangCode,
    dataSource: DataSource,
    entityId: Entity["id"],
    propId?: EntityProp["id"],
  ): AppThunk =>
  async (dispatch) => {
    dispatch(reset());

    const wikipediaSlug = await getEntityWikipediaSlug(
      entityId,
      langCode,
      dataSource,
    );

    let propSlug = "";
    if (propId) {
      const translatedProps = await getWikibaseEntityProps(
        entityId,
        langCode,
        dataSource,
      );

      const translatedProp = translatedProps?.find(({ id }) => id === propId);

      if (translatedProp) propSlug = translatedProp.slug;
    }

    const url = getEntityUrl(
      langCode,
      propSlug,
      dataSource,
      entityId,
      wikipediaSlug,
    );

    router.push(url);
  };
