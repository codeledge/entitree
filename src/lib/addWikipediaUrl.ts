import { BigEntity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addWikipediaUrl(
  entity: BigEntity,
  languageCode: LangCode,
) {
  const sitelink = entity.sitelinks?.[languageCode + "wiki"];
  if (sitelink?.url) {
    entity.wikipediaUrl = sitelink.url;
    entity.wikipediaSlug = sitelink.url?.split("/wiki/")[1];
  }
}
