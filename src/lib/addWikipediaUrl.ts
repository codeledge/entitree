import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addWikipediaUrl(entity: Entity, langCode: LangCode) {
  const sitelink = entity.sitelinks?.[langCode + "wiki"];
  if (sitelink?.url) {
    entity.wikipediaUrl = sitelink.url;
    entity.wikipediaSlug = sitelink.url?.split("/wiki/")[1];
  }
}
