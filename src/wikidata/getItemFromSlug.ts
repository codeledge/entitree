import { LangCode } from "types/Lang";
import axios from "axios";
import { wikibaseInstance } from "lib/wikibaseInstance";

export default async function getItemFromSlug(
  slug: string,
  langCode: LangCode,
): Promise<string> {
  const wdk = wikibaseInstance("wikidata");

  const url = await new Promise<string>((resolve, reject) => {
    try {
      const query = `
      SELECT ?item WHERE {
        ?sitelink schema:about ?item;
        schema:isPartOf <https://${langCode}.wikipedia.org/>;
        schema:name "${slug.replace(/_/g, " ")}"@${langCode}.
      }`.trim();

      const url = wdk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return axios
    .get(url)
    .then(({ data }) => wdk.simplify.sparqlResults(data))
    .then((results) => {
      const [{ item: itemId }] = results;
      return itemId;
    });
}
