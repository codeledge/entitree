import { Entity, WikiEntity } from "types/Entity";

import { LangCode } from "types/Lang";
import addAbolishedDate from "./addAbolishedDate";
import addBirthDate from "./addBirthDate";
import addBirthName from "./addBirthName";
import addBirthPlaceId from "./addBirthPlaceId";
import addCountryOfCitizenship from "./addCountryOfCitizenship";
import addDeathDate from "./addDeathDate";
import addDeathPlaceId from "./addDeathPlaceId";
import addDescription from "./addDescription";
import addEndDate from "./addEndDate";
import addExternalLinks from "./addExternalLinks";
import addEyeColor from "./addEyeColor";
import addGender from "./addGender";
import addGeniId from "./addGeniId";
import addHairColor from "./addHairColor";
import addImages from "./addImages";
import addInceptionAbolishedSpan from "./addInceptionAbolishedSpan";
import addInceptionDate from "./addInceptionDate";
import addIsHuman from "./addIsHuman";
import addIsInfantDeath from "./addIsInfantDeath";
import addLabel from "./addLabel";
import addLifeSpan from "./addLifeSpan";
import { addPeoplePillImage } from "./addPeoplePillImage";
import addReligion from "./addReligion";
import addStartDate from "./addStartDate";
import addStartEndSpan from "./addStartEndSpan";
import addWebsite from "./addWebsite";
import addWikidataUrl from "./addWikidataUrl";
import addWikipediaUrl from "./addWikipediaUrl";
import getTreeId from "treeHelpers/getTreeId";
import wbk from "wikidata-sdk";

export default function formatEntity(
  wikidataEntity: WikiEntity,
  languageCode: LangCode,
) {
  const simpleClaims = wbk.simplify.claims(wikidataEntity.claims, {
    keepQualifiers: true,
  });

  const entity: Entity = {
    treeId: getTreeId(),
    ...wikidataEntity,
    simpleClaims,
  };

  addLabel(entity, languageCode);
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

  addImages(entity);

  addCountryOfCitizenship(entity);

  addReligion(entity);

  addEyeColor(entity);
  addHairColor(entity);

  addPeoplePillImage(entity);

  addGeniId(entity);

  return entity;
}
