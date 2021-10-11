import { Entity, EntityProp, GeniEntity } from "types/Entity";

import { LangCode } from "types/Lang";
import { WikibaseAlias } from "wikibase/getWikibaseInstance";
import { getRootEntity } from "geni/lib/getEntities";

export const loadEntity = async ({
  itemId,
  langCode,
}: {
  itemId: string;
  wikibaseAlias: WikibaseAlias;
  langCode: LangCode;
}): Promise<{
  currentEntity: GeniEntity;
}> => {
  const currentEntity = await getRootEntity(itemId, langCode, {
    wikibaseAlias: "geni",
    addUpIds: true,
    addDownIds: true,
    addLeftIds: false,
    addRightIds: false,
    serverside: true,
  });

  return { currentEntity };
};
