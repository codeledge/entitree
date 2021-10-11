// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GeniEntity } from "types/Entity";
import { GeniImmediateFamily } from "services/geniService";

// import { LangCode } from "types/Lang";

export default function formatGeniProfile(geniResult: GeniImmediateFamily) {
  const geniProfile = geniResult.focus;
  const entity: GeniEntity = {
    ...geniResult,
  };
  entity.id = "Q10000";
  entity.label = geniProfile.name; //geniProfile?.first_name + " " + geniProfile?.last_name;
  entity.description = geniProfile?.id || "";
  entity.birthDate = geniProfile?.birth?.date?.formatted_date;
  if (geniProfile?.mugshot_urls?.thumb) {
    const geniImg = {
      url: geniProfile.mugshot_urls.medium,
      alt: `Geni.com image`,
      sourceUrl: geniProfile.profile_url,
      downloadUrl:
        geniProfile.mugshot_urls.large ?? geniProfile.mugshot_urls.medium,
    };
    console.log(geniImg);
    entity.thumbnails = [geniImg];
  }
  return entity;
}
