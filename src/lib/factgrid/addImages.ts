import { Entity } from "types/Entity";

const THUMB_SIZE = 80;

export default function addFactgridImages(
  entity: Entity,
  //theme: DefaultTheme = defaultTheme, // is gonna be hard to get theme here, e.g. on the server
) {
  entity.thumbnails = [];

  const imageClaim = entity.simpleClaims?.P189;
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
}

function getCommonsUrlByFile(filename, size) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${size}px`;
}
