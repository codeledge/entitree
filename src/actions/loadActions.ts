import { Entity, EntityProp } from "types/Entity";

import { AppThunk } from "store";
import { LangCode } from "types/Lang";
import { getEntityUrl } from "helpers/getEntityUrl";
import getEntityWikipediaSlug from "treeHelpers/getEntityWikipediaSlug";
import getItemProps from "wikidata/getItemProps";
import { reset } from "store/treeSlice";
import router from "next/router";

export const switchLanguage =
  (
    langCode: LangCode,
    wikibase: string,
    entityId: Entity["id"],
    propId?: EntityProp["id"],
  ): AppThunk =>
  async (dispatch) => {
    dispatch(reset());

    const wikipediaSlug = await getEntityWikipediaSlug(
      entityId,
      langCode,
      wikibase,
    );

    let propSlug = "";
    if (propId) {
      const translatedProps = await getItemProps(entityId, langCode, wikibase);

      const translatedProp = translatedProps.find(({ id }) => id === propId);

      if (translatedProp) propSlug = translatedProp.slug;
    }

    const url = getEntityUrl(
      langCode,
      propSlug,
      {
        id: entityId,
        wikipediaSlug,
      },
      wikibase,
    );
    router.push(url);
  };
