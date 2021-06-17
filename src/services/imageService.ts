import axios from "axios";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

export const IMAGE_SERVER_BASE_URL = "https://images.dataprick.com";

export const missingImagesLink = (id, label) => {
  const params = new URLSearchParams({
    qId: id,
    qLabel: label,
  });

  return IMAGE_SERVER_BASE_URL + "/image/single_upload?" + params.toString();
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
            url: `${IMAGE_SERVER_BASE_URL}/api/v1/image/facecrop/id/${dpImg.id}`,
            alt: descr,
            imageDb: true,
          },
          thumbnail: {
            url: `${IMAGE_SERVER_BASE_URL}/api/v1/image/thumbnail/id/${dpImg.id}`,
            alt: descr,
            imageDb: true,
          },
        };
      });
    })
    .catch();
};
