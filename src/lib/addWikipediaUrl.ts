import { Entity } from "types/Entity";
import { LangCode } from "types/Lang";

export default function addWikipediaUrl(entity: Entity, langCode: LangCode) {
  const sitelink = entity.sitelinks?.[langCode + "wiki"];
  if (sitelink?.url) {
    entity.wikipediaUrl = sitelink.url;
    const wikipediaSlug = sitelink.url?.split("/wiki/")[1];
    if (wikipediaSlug) {
      //eg https://en.wikipedia.org/wiki/Salvador_Dal%C3%AD
      entity.wikipediaSlug = decodeURIComponent(wikipediaSlug);
    }
  }
}
