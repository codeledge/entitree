import { Entity, WikiEntity } from "types/Entity";

import addAbolishedDate from "./addAbolishedDate";
import addBirthDate from "./addBirthDate";
import addBirthName from "./addBirthName";
import addBirthPlaceId from "./addBirthPlaceId";
import addDeathDate from "./addDeathDate";
import addDeathPlaceId from "./addDeathPlaceId";
import addDescription from "./addDescription";
import addEndDate from "./addEndDate";
import addExternalLinks from "./addExternalLinks";
import addGender from "./addGender";
import addImages from "./addImages";
import addInceptionAbolishedSpan from "./addInceptionAbolishedSpan";
import addInceptionDate from "./addInceptionDate";
import addIsHuman from "./addIsHuman";
import addIsInfantDeath from "./addIsInfantDeath";
import addLabel from "./addLabel";
import addLifeSpan from "./addLifeSpan";
import addSecondLabel from "./addSecondLabel";
import addStartDate from "./addStartDate";
import addStartEndSpan from "./addStartEndSpan";
import addWebsite from "./addWebsite";
import addWikidataUrl from "./addWikidataUrl";
import addWikipediaUrl from "./addWikipediaUrl";
import store from "store";
import wbk from "wikidata-sdk";

export default function formatEntity(wikidataEntity: WikiEntity) {
  const {
    settings: { languageCode, secondLanguageCode },
    theme,
  } = store.getState();

  const simpleClaims = wbk.simplify.claims(wikidataEntity.claims, {
    keepQualifiers: true,
  });

  const entity: Entity = {
    ...wikidataEntity,
    simpleClaims,
  };

  addLabel(entity, languageCode);
  if (secondLanguageCode) addSecondLabel(entity, secondLanguageCode);
  addDescription(entity, languageCode);

  addBirthDate(entity, languageCode);
  addDeathDate(entity, languageCode);
  addIsInfantDeath(entity);
  addLifeSpan(entity);

  addBirthPlaceId(entity);
  addDeathPlaceId(entity);

  addStartDate(entity, languageCode);
  addEndDate(entity, languageCode);
  addStartEndSpan(entity);

  addInceptionDate(entity, languageCode);
  addAbolishedDate(entity, languageCode);
  addInceptionAbolishedSpan(entity);

  addWikidataUrl(entity);

  addWikipediaUrl(entity, languageCode);

  addExternalLinks(entity);

  addBirthName(entity);

  addWebsite(entity);

  addGender(entity);

  addIsHuman(entity);

  addImages(entity, theme);

  return entity;
}
