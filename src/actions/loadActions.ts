import { Entity, EntityProp } from "types/Entity";

import { AppThunk } from "store";
import { LangCode } from "types/Lang";
import { getEntityUrl } from "helpers/getEntityUrl";
import getEntityWikipediaSlug from "treeHelpers/getEntityWikipediaSlug";
import getItemProps from "wikidata/getItemProps";
import { reset } from "store/treeSlice";
import router from "next/router";

export const switchLanguage = (
  entityId: Entity["id"],
  propId: EntityProp["id"],
  langCode: LangCode,
): AppThunk => async (dispatch) => {
  dispatch(reset());

  const wikipediaSlug = await getEntityWikipediaSlug(entityId, langCode);

  const translatedProps = await getItemProps(entityId, langCode);

  const translatedProp = translatedProps.find(({ id }) => id === propId);

  if (translatedProp) {
    const url = getEntityUrl(
      langCode,
      { id: translatedProp.id, slug: translatedProp.slug },
      {
        id: entityId,
        wikipediaSlug,
      },
    );
    router.push(url);
  }
};
