import { ImageOverflowType, ImageType } from "types/Image";

import axios from "axios";
import { errorHandler } from "handlers/errorHandler";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

export const IMAGE_SERVER_BASE_URL = "https://images.entitree.com";
// export const IMAGE_SERVER_BASE_URL = "http://localhost:3010";

export const IMAGE_SERVER_TYPES: ImageType[] = [
  { code: "transparent_face" },
  { code: "transparent_head" },
  { code: "face" },
];
export const IMAGE_SERVER_OVERFLOW: ImageOverflowType[] = [
  { code: "no", label: "no" },
  { code: "yes", label: "yes" },
  { code: "both_sides", label: "cut sides" },
  { code: "left_side", label: "cut left side" },
  {
    code: "left_shoulder",
    label: "cut left shoulder",
  },
];

export const missingImagesLink = (extra = {}) => {
  const params = new URLSearchParams({
    source: JSON.stringify(extra),
  });

  return IMAGE_SERVER_BASE_URL + "/#/images/create?" + params.toString();
};

export const imageServer = axios.create({
  baseURL: IMAGE_SERVER_BASE_URL,
  timeout: 3000,
});

imageServer.interceptors.response.use(serviceSuccessInterceptor);

type DPImage = {
  id?: string;
  uploadSite?: string;
  comment?: string;
  recordedDate?: string;
  sourceUrl?: string;
  url?: any;
};

export const getDataprickImages = (numericId: string) => {
  return imageServer
    .get<any, { images: DPImage[] }>(`/api/v1/image/info/wikidata/${numericId}`)
    .then(({ images }) => {
      return images.map((dpImg) => {
        // const dpImg = data.images[0];
        let descr = `${dpImg.uploadSite}\nImage Database`;
        if (dpImg.comment) {
          descr += `\n${dpImg.comment}`;
        }
        if (dpImg.recordedDate) {
          descr += `\nPhoto taken in ${dpImg.recordedDate.substr(0, 4)}`;
        }
        if (dpImg.sourceUrl) {
          descr += `\n\n${dpImg.sourceUrl}`;
        }

        return {
          url: dpImg.url.transparent_face,
          urlByType: dpImg.url,
          title: descr,
          imageDb: true,
          sourceUrl: IMAGE_SERVER_BASE_URL + "/#/images/" + dpImg.id + "/show",
        };
      });
    })
    .catch(errorHandler);
};
