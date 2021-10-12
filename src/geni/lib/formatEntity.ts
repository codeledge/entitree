import { GeniEntity } from "types/Entity";
import { GeniImmediateFamily } from "services/geniService";
import addLifeSpan from "lib/addLifeSpan";

// import { LangCode } from "types/Lang";

export default function formatGeniProfile(geniResult: GeniImmediateFamily) {
  const geniProfile = geniResult.focus;
  const entity: GeniEntity = {
    ...geniResult,
  };
  entity.id = geniProfile?.id.substr(8) || "";
  entity.gender = geniProfile?.gender || "";
  entity.isHuman = true;
  entity.label = geniProfile?.name; //geniProfile?.first_name + " " + geniProfile?.last_name;
  entity.description = geniProfile?.id || "";
  entity.geniId = geniProfile?.profile_url.split("/").pop();
  entity.geniProfileUrl = geniProfile?.profile_url;
  const firstNames = geniProfile?.first_name + " " + geniProfile?.middle_name;
  entity.birthName = geniProfile;
  //add Geni dates and country
  if (geniProfile?.birth || geniProfile?.death) {
    if (geniProfile.birth && geniProfile.birth.date) {
      entity.birthYear = "" + geniProfile.birth.date.year; //convert to string
      if (
        geniProfile.birth.date.circa &&
        geniProfile.birth.date.circa === true
      ) {
        entity.birthYear = "~" + entity.birthYear;
      }
    }
    if (geniProfile.death && geniProfile.death.date) {
      entity.deathYear = "" + geniProfile.death.date.year;
      if (
        geniProfile.death.date.circa &&
        geniProfile.death.date.circa === true
      ) {
        entity.deathYear = "~" + entity.deathYear;
      }
    }
    addLifeSpan(entity);
  }
  if (
    geniProfile &&
    geniProfile.birth &&
    geniProfile.birth.location &&
    geniProfile.birth.location.country_code
  ) {
    entity.countryOfCitizenship = {
      code: geniProfile.birth.location.country_code,
      name: geniProfile.birth.location.country,
      text: "Born in " + geniProfile.birth.location.country + " (geni)",
    };
  } else if (
    geniProfile &&
    geniProfile.location &&
    geniProfile.location.country_code
  ) {
    entity.countryOfCitizenship = {
      code: geniProfile.location.country_code,
      name: geniProfile.location.country,
      text: "Lived in " + geniProfile.location.country + " (geni)",
    };
  }

  if (geniProfile?.mugshot_urls?.thumb) {
    const geniImg = {
      url: geniProfile.mugshot_urls.medium,
      alt: `Geni.com image`,
      sourceUrl: geniProfile.profile_url,
      downloadUrl:
        geniProfile.mugshot_urls.large ?? geniProfile.mugshot_urls.medium,
    };
    entity.thumbnails = [geniImg];
  }
  console.log(entity);
  return entity;
}
