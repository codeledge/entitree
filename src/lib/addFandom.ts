import { Entity } from "types/Entity";
import { ENGLISH_ID } from "constants/entities";
import { FANDOM_ARTICLE_ID, LANGUAGE_OF_WORK_ID } from "constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addFandom(entity: Entity) {
  if (getSimpleClaimValue(entity.simpleClaims, FANDOM_ARTICLE_ID)) {
    const fandomClaims = entity.simpleClaims?.[FANDOM_ARTICLE_ID];
    const englishArticle = fandomClaims?.find(
      (entry) =>
        entry.qualifiers &&
        entry.qualifiers[LANGUAGE_OF_WORK_ID] &&
        entry.qualifiers[LANGUAGE_OF_WORK_ID][0] === ENGLISH_ID,
    );
    let fandomId: any;
    if (englishArticle) {
      fandomId = englishArticle.value.split(":");
    } else {
      fandomId = getSimpleClaimValue(
        entity.simpleClaims,
        FANDOM_ARTICLE_ID,
      )?.split(":");
    }
    //exclude russian fandoms as they don't have an api
    if (fandomId[1] && fandomId[0].substr(0, 3) !== "ru.") {
      [entity.fandomHost, entity.fandomId] = fandomId;
      entity.fandomUrl = `https://${entity.fandomHost}.fandom.com/wiki/${entity.fandomId}`;
    }
  }
}
