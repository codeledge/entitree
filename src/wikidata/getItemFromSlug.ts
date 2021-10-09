import { LangCode } from "types/Lang";
import axios from "axios";
import { errorHandler } from "handlers/clientErrorHandler";
import { getWikibaseInstance } from "wikibase/getWikibaseInstance";

export default async function getItemFromSlug(
  slug: string,
  langCode: LangCode,
): Promise<string> {
  const wikibaseInstance = getWikibaseInstance("wikidata");

  const url = await new Promise<string>((resolve, reject) => {
    try {
      const query = `
      SELECT ?item WHERE {
        ?sitelink schema:about ?item;
        schema:isPartOf <https://${langCode}.wikipedia.org/>;
        schema:name "${slug.replace(/_/g, " ")}"@${langCode}.
      }`.trim();

      const url = wikibaseInstance.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return axios
    .get(url)
    .then(({ data }) => wikibaseInstance.simplify.sparqlResults(data))
    .then((results) => {
      const [result] = results;
      return result?.item;
    })
    .catch(errorHandler);
}
