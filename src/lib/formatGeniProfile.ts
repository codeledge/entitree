import { Entity, Image } from "types/Entity";

import { GeniProfile } from "types/Geni";
import addGeniDates from "./addGeniDates";

export const formatGeniProfile = (geniProfile: GeniProfile) => {
  const entity: Entity = {
    id: "G" + geniProfile?.guid || "",
  };

  entity.gender = geniProfile?.gender || "";
  entity.isHuman = true;
  entity.label = geniProfile?.name; //geniProfile?.first_name + " " + geniProfile?.last_name;
  entity.description = geniProfile?.occupation || "";
  entity.geniProfileId = entity.id;
  entity.geniId = geniProfile?.guid; //geniProfile?.profile_url.split("/").pop();
  entity.geniProfileUrl = geniProfile?.profile_url;
  // entity.occupation = geniProfile?.occupation || "";
  const firstNames =
    geniProfile?.first_name +
    (geniProfile?.middle_name ? " " + geniProfile?.middle_name : "");
  entity.birthName =
    firstNames +
    " " +
    (geniProfile.maiden_name ? geniProfile.maiden_name : geniProfile.last_name);
  entity.birthPlace = geniProfile?.birth?.location?.formatted_location || "";
  entity.deathPlace = geniProfile?.death?.location?.formatted_location || "";

  addGeniDates(entity, geniProfile);
  addCountryOfCitizenship(entity, geniProfile);
  if (geniProfile?.mugshot_urls?.thumb) {
    const geniImg: Image = {
      url: geniProfile.mugshot_urls.medium,
      alt: `Geni.com image`,
      sourceUrl: geniProfile.profile_url,
      downloadUrl:
        geniProfile.mugshot_urls.large ?? geniProfile.mugshot_urls.medium,
    };
    entity.thumbnails = [geniImg];
  }
  return entity;
};

const addCountryOfCitizenship = (entity: Entity, geniProfile: GeniProfile) => {
  if (geniProfile?.birth?.location?.country_code) {
    entity.countryOfCitizenship = {
      code: geniProfile.birth.location.country_code,
      name: geniProfile.birth.location.country,
      text: "Born in " + geniProfile.birth.location.country + " (geni)",
    };
  } else if (geniProfile?.location?.country_code) {
    entity.countryOfCitizenship = {
      code: geniProfile.location.country_code,
      name: geniProfile.location.country,
      text: "Lived in " + geniProfile.location.country + " (geni)",
    };
  }
};
