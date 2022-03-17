import {
  WD_ENGLISH,
  WD_FANDOM_ARTICLE_ID,
  WD_LANGUAGE_OF_WORK_OR_NAME,
} from "@entitree/wikidata-helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addFandom(entity: Entity) {
  if (getSimpleClaimValue(entity.simpleClaims, WD_FANDOM_ARTICLE_ID)) {
    const fandomClaims = entity.simpleClaims?.[WD_FANDOM_ARTICLE_ID];
    const englishArticle = fandomClaims?.find(
      (entry) =>
        entry.qualifiers &&
        entry.qualifiers[WD_LANGUAGE_OF_WORK_OR_NAME] &&
        entry.qualifiers[WD_LANGUAGE_OF_WORK_OR_NAME][0] === WD_ENGLISH,
    );
    let fandomId: any;
    if (englishArticle) {
      fandomId = englishArticle.value.split(":");
    } else {
      fandomId = getSimpleClaimValue(
        entity.simpleClaims,
        WD_FANDOM_ARTICLE_ID,
      )?.split(":");
    }
    //exclude russian fandoms as they don't have an api
    if (fandomId[1] && fandomId[0].substr(0, 3) !== "ru.") {
      [entity.fandomHost, entity.fandomId] = fandomId;
      entity.fandomUrl = `https://${entity.fandomHost}.fandom.com/wiki/${entity.fandomId}`;
    }
  }
}
