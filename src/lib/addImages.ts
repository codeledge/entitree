import { IMAGE_ID, LOGO_ID } from "../constants/properties";

import { Entity } from "types/Entity";

const THUMB_SIZE = 80;

export default function addImages(
  entity: Entity,
  //theme: DefaultTheme = defaultTheme, // is gonna be hard to get theme here, e.g. on the server
) {
  entity.thumbnails = [];

  const imageClaim = entity.simpleClaims?.[IMAGE_ID];
  if (imageClaim) {
    imageClaim.forEach((image, index) => {
      //catch undefined value
      if (image.value) {
        const imageData = {
          url: getCommonsUrlByFile(image.value, THUMB_SIZE * 2),
          sourceUrl: `https://commons.wikimedia.org/wiki/File:${image.value}`,
          // wikimediaFilename: image.value,
          alt: `${entity.label}'s Image ${
            index + 1
          } from Wikimedia Commons\nPlease refer to https://commons.wikimedia.org/wiki/File:${
            image.value
          } for credits`,
        };
        entity.thumbnails?.push(imageData);
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
          url: getCommonsUrlByFile(image.value, THUMB_SIZE),
          alt: `${entity.label}'s Logo ${index + 1} from Wikimedia Commons`,
        });
      }
    });
  }
}

function getCommonsUrlByFile(filename, size) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${size}px`;
}
