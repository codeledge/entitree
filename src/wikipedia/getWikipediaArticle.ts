import axios from "axios";

export default function getWikipediaArticle(
  wikipediaSlug: string,
  currentLangCode: string,
) {
  return axios.get(
    `https://${currentLangCode}.wikipedia.org/api/rest_v1/page/summary/${wikipediaSlug}`,
  );
}
