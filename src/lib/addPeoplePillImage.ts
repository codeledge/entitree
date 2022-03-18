import { WD_HUMAN, WD_INSTANCE_OF } from "@entitree/helper";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addPeoplePillImage(entity: Entity) {
  if (
    getSimpleClaimValue(entity.simpleClaims, WD_INSTANCE_OF) === WD_HUMAN &&
    !entity.sitelinks?.enwiki?.title?.includes("(") //peoplePill uses a counter for same names
  ) {
    //TODO: check for foreign characters
    const peoplepillSlug = entity.sitelinks?.enwiki?.title
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/,/g, "")
      .replace(/\./g, "")
      .replace(/ñ/g, "n");

    if (peoplepillSlug) entity.peoplepillSlug = peoplepillSlug;

    //web archive will redirect to last cached version
    if (entity.peoplepillSlug) {
      entity.peoplepillImageUrl =
        "https://web.archive.org/web/20220210233602if_/https://peoplepill.com/media/people/thumbs/" +
        entity.peoplepillSlug?.substring(0, 1).toUpperCase() +
        "/" +
        entity.peoplepillSlug +
        ".jpg";
    }
  }
}
