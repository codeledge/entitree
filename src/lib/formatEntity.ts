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
import addFactgridUrl from "./addFactgridUrl";
import addFandom from "./addFandom";
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
import addOccupations from "./addOccupations";
import addPeoplePillImage from "./addPeoplePillImage";
import addReligion from "./addReligion";
import addSecondLabels from "./addSecondLabels";
import addStartDate from "./addStartDate";
import addStartEndSpan from "./addStartEndSpan";
import addWebsite from "./addWebsite";
import addWikidataUrl from "./addWikidataUrl";
import addWikipediaUrl from "./addWikipediaUrl";
import { baseDomain } from "./wikibaseInstance";
import wbk from "wikibase-sdk";

export default function formatEntity(
  wikidataEntity: WikiEntity,
  languageCode: LangCode,
) {
  const simpleClaims = wbk.simplify.claims(wikidataEntity.claims, {
    keepQualifiers: true,
  });

  const entity: Entity = {
    ...wikidataEntity,
    simpleClaims,
  };

  addLabel(entity, languageCode);
  addDescription(entity, languageCode);
  if (baseDomain === "database.factgrid.de") {
    addFactgridUrl(entity);
  }

  if (baseDomain === "www.wikidata.org") {
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
    addSecondLabels(entity);

    addWebsite(entity);

    addGender(entity);

    addIsHuman(entity);

    addImages(entity);

    addCountryOfCitizenship(entity);

    addReligion(entity);

    addOccupations(entity);

    addEyeColor(entity);
    addHairColor(entity);

    addPeoplePillImage(entity);

    addFandom(entity);

    addGeniId(entity);
  }
  return entity;
}
