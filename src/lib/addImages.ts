import { IMAGE_ID, LOGO_ID } from "../constants/properties";

import { DefaultTheme } from "styled-components";
import { Entity } from "types/Entity";

export default function addImages(entity: Entity, theme: DefaultTheme) {
  entity.thumbnails = [];
  entity.images = [];

  const imageClaim = entity.simpleClaims?.[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      //catch undefined value
      if (image.value) {
        entity.thumbnails?.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
          alt: `${entity.label}'s Image ${
            index + 1
          } from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${
            image.value
          } for credits`,
        });
        entity.images?.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
          alt: `${entity.label}'s Image ${
            index + 1
          } from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${
            image.value
          } for credits`,
        });
      }
    });
  }

  // const twitterClaim = entity.simpleClaims[TWITTER_ID];
  // if (twitterClaim) {
  //   //https://github.com/siddharthkp/twitter-avatar
  //   twitterClaim.forEach((image) => {
  //     const img = {
  //       url: `/twitter/getImage/${image.value}`,
  //       alt: `${entity.label}'s Twitter image`,
  //     };
  //     entity.thumbnails.push(img);
  //     entity.images.push(img);
  //   });
  // }

  //Logo last, people might have logos like Trump
  const logoClaim = entity.simpleClaims?.[LOGO_ID];
  if (logoClaim) {
    logoClaim.forEach((image, index) => {
      //catch undefined value
      if (image.value) {
        entity.thumbnails?.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth),
          alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
        });
        entity.images?.push({
          url: getCommonsUrlByFile(image.value, theme?.thumbWidth * 2),
          alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
        });
      }
    });
  }
}

function getCommonsUrlByFile(filename, size) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${size}px`;
}
