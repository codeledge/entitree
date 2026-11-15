import { DataSource, getEntityWikipediaSlug } from "@entitree/helper";
import { Entity, EntityProp } from "types/Entity";

import { AppThunk } from "store";
import { LangCode } from "types/Lang";
import { getEntityUrl } from "helpers/getEntityUrl";
import { reset, setCurrentEntityProps } from "store/treeSlice";

import { buildEntityProps } from "treeHelpers/getCurrentEntity";
import getWikibaseEntityProps from "wikibase/getWikibaseEntityProps";
import router from "next/router";

// The props dropdown is not part of the server render, it's loaded afterwards
export const loadEntityProps =
  (
    entityId: Entity["id"],
    langCode: LangCode,
    dataSource: DataSource,
  ): AppThunk =>
  async (dispatch, getState) => {
    const rawProps = await getWikibaseEntityProps(
      entityId,
      langCode,
      dataSource,
    );
    const { entityProps } = buildEntityProps(rawProps, langCode, dataSource);

    // the user might have moved to another entity in the meantime
    if (getState().tree.currentEntity?.id !== entityId) return;

    dispatch(setCurrentEntityProps(entityProps));
  };

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
