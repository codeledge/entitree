import axios from "axios";
import { GeniProfile, GeniImmediateFamily } from "geni-api";
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
      guids: ids.map((id) => id.substring(1)).join(","),
    },
  });
};

export const getGeniImmediateFamilyCall = (
  ids: string[],
): Promise<GeniImmediateFamily[]> => {
  return apiService.get("/getGeniImmediateFamilyEndpoint", {
    params: {
      guids: ids.map((id) => id.substring(1)).join(","),
    },
  });
};
