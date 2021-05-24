import axios from "axios";
import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

const wikidataService = axios.create({
  baseURL: "https://www.wikidata.org",
});

wikidataService.interceptors.response.use(serviceSuccessInterceptor);

export type SearchResult = {
  aliases: string[]; // ["Queen Elizabeth II"]
  id: string; // Q623
  description: string; // "chemical element with symbol C and atomic number 6; common element of all known life"
  concepturi: string; // "http://www.wikidata.org/entity/Q623"
  label: string; // carbon
  match: {
    language: string; // en
    text: string; // carbon
    type: string; // label
  };
  pageid: number; // 908
  repository: string; // wikidata
  title: string; // Q623
  url: string; // www.wikidata.org/wiki/Q623
};

type Response = {
  search: SearchResult[];
  "search-continue": number;
  searchinfo: { search: string };
  success: number;
  error?: {
    code: string;
    info: string;
    "*": string;
  };
  servedby: string;
};

export const searchTerm = async (term, languageCode) => {
  const { search, error } = await wikidataService.get<any, Response>(
    "/w/api.php",
    {
      params: {
        origin: "*",
        action: "wbsearchentities",
        format: "json",
        uselang: languageCode,
        language: languageCode,
        search: term,
      },
    },
  );
  if (error) throw error;

  return search;
};

export default wikidataService;
