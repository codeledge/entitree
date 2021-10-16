import { GeniImmediateFamily, GeniProfile } from "services/geniService";

import { Entity } from "types/Entity";
import addGeniDates from "./addDates";
import addLifeSpan from "lib/addLifeSpan";

export default function formatGeniProfile(geniProfile: GeniProfile) {
  // const geniProfile = geniResult; //.focus;
  const entity: Entity = {
    id: "G" + geniProfile?.guid || "",
    focus: geniProfile,
  };
  if (!geniProfile) {
    return entity; //FIX
  }
  entity.gender = geniProfile?.gender || "";
  entity.isHuman = true;
  entity.label = geniProfile?.name; //geniProfile?.first_name + " " + geniProfile?.last_name;
  entity.description = geniProfile?.id || "";
  entity.geniProfileId = entity.id;
  entity.geniId = geniProfile?.guid; //geniProfile?.profile_url.split("/").pop();
  entity.geniProfileUrl = geniProfile?.profile_url;
  entity.occupation = geniProfile?.occupation || "";
  const firstNames = geniProfile?.first_name + " " + geniProfile?.middle_name;
  entity.birthName = firstNames;
  //add Geni dates and country
  addGeniDates(entity, geniProfile, "en");
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
  // console.log(entity);
  return entity;
}
