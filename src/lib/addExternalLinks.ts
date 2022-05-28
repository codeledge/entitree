/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { formatUrl, WIKIDATA_ICON } from "@entitree/helper";
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
  for (const social of SOCIAL_PROPS_IDS) {
    const claimValue = getSimpleClaimValue(simpleClaims, social.id);
    if (claimValue) {
      const { title, iconName } = social;
      socialProps.push({
        title,
        iconSrc: WIKIDATA_ICON[social.id]
          ? WIKIDATA_ICON[social.id]
          : `/icons/${iconName}.png`,
        alt: iconName + " icon",
        url: formatUrl(social.id, claimValue),
      });
    }
  }
  if (socialProps.length) {
    entity.externalLinks = socialProps;
  }
}
