import { DateTime } from "luxon";
import { Entity } from "types/Entity";
import { GeniProfile } from "types/Geni";
import addLifeSpan from "lib/addLifeSpan";

function convertGeniDate(input, languageCode = "en") {
  // console.log(input.formatted_date);
  const parsedDate = DateTime.local(input.year, input.month, input.day);
  return parsedDate.setLocale(languageCode).toFormat("d MMM y");
}

function convertGeniDateToISO(input, languageCode = "en") {
  // console.log(input.formatted_date);
  const parsedDate = DateTime.local(input.year, input.month, input.day);
  return parsedDate.setLocale(languageCode).toISO();
}

export default function addGeniDates(entity: Entity, geniProfile: GeniProfile) {
  if (geniProfile?.birth || geniProfile?.death) {
    if (geniProfile.birth && geniProfile.birth.date) {
      entity.birthYear = "" + geniProfile.birth.date.year; //convert to string
      entity.birthDate = convertGeniDate(geniProfile.birth.date);
      entity.birthISO = convertGeniDateToISO(geniProfile.birth.date);
      if (
        geniProfile.birth.date.circa &&
        geniProfile.birth.date.circa === true
      ) {
        entity.birthYear = "~" + entity.birthYear;
      }
    }
    if (geniProfile.death && geniProfile.death.date) {
      entity.deathYear = "" + geniProfile.death.date.year;
      entity.deathDate = convertGeniDate(geniProfile.death.date);
      // entity.deathISO = convertGeniDateToISO(geniProfile.death.date);
      if (
        geniProfile.death.date.circa &&
        geniProfile.death.date.circa === true
      ) {
        entity.deathYear = "~" + entity.deathYear;
      }
    }
    addLifeSpan(entity);
  }
}
