import { GeniProfile } from "types/Geni";
import axios from "axios";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

const apiService = axios.create({
  baseURL: "/api",
});

apiService.interceptors.response.use(serviceSuccessInterceptor);

export const searchGeniCall = (term: string): Promise<GeniProfile[]> => {
  return apiService.get("/searchGeniEndpoint", {
    params: {
      term,
    },
  });
};
