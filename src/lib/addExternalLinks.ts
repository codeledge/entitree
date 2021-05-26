/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Entity, ExternalLink } from "types/Entity";

import { SOCIAL_PROPS_IDS } from "../constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

/**
 * Gets a list of social media icons
 * @param claims accepts wbk.simplify.claims
 */
export default function addExternalLinks(entity: Entity) {
  const socialProps: ExternalLink[] = [];
  const { simpleClaims } = entity;
  for (const socialPropId in SOCIAL_PROPS_IDS) {
    const claimValue = getSimpleClaimValue(simpleClaims, socialPropId);
    if (claimValue) {
      const { alt, baseUrl, title, iconName } = SOCIAL_PROPS_IDS[socialPropId];
      socialProps.push({
        title,
        iconSrc: `/icons/${iconName}.png`,
        alt,
        url: baseUrl + claimValue,
      });
    }
  }
  if (socialProps.length) {
    entity.externalLinks = socialProps;
  }
}
