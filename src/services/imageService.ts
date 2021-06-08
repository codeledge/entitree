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
