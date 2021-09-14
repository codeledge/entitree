import { LangCode } from "types/Lang";
import axios from "axios";
import { wikibaseInstance } from "lib/wikibaseInstance";

const wdk = wikibaseInstance();

export default async function getEntityWikipediaSlug(
  id: string,
  langCode: LangCode,
) {
  const url = await wdk.getEntities({
    ids: [id],
    languages: [langCode],
    props: ["sitelinks/urls"],
  });

  const {
    data: { entities },
  } = await axios.get(url);

  const wikipediaSlug = entities[id]?.sitelinks?.[
    langCode + "wiki"
  ]?.url?.split("/wiki/")[1];

  return wikipediaSlug;
}
