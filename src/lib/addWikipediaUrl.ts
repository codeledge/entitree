import { BigEntity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addWikipediaUrl(
  entity: BigEntity,
  languageCode: LangCode,
) {
  entity.sitelink = entity.sitelinks?.[languageCode + "wiki"];
  entity.wikipediaUrl = entity.sitelink?.url;
  entity.wikipediaSlug = entity.wikipediaUrl?.split("/wiki/")[1];
}
