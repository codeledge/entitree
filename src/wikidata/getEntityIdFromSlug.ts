import { LangCode } from "types/Lang";
import axios from "axios";
import { errorHandler } from "handlers/errorHandler";
import { getWikibaseInstance } from "wikibase/getWikibaseInstance";

export default async function getEntityIdFromSlug(
  slug: string,
  langCode: LangCode,
): Promise<string> {
  const wikibaseInstance = getWikibaseInstance("wikidata");

  //TODO: why is this a promise?
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
      return results?.[0]?.item;
    })
    .catch(errorHandler);
}
