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

export const getGeniProfilesCall = (ids: string[]): Promise<GeniProfile[]> => {
  return apiService.get("/getGeniProfilesEndpoint", {
    params: {
      guids: ids.map((id) => id.substr(1)).join(","),
    },
  });
};
