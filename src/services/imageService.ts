import axios from "axios";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

export const IMAGE_SERVER_BASE_URL = "http://localhost:3010";

export const missingImagesLink = (extra = {}) => {
  const params = new URLSearchParams({
    ...extra,
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
          faceImage: {
            url: dpImg.url.transparent_face,
            title: descr,
            imageDb: true,
          },
          thumbnail: {
            url: dpImg.url.transparent_face,
            title: descr,
            imageDb: true,
            sourceUrl:
              IMAGE_SERVER_BASE_URL + "/#/images/" + dpImg.id + "/show",
          },
        };
      });
    })
    .catch();
};
