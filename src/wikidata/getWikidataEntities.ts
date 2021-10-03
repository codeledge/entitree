import {
  WikibaseAlias,
  getWikibaseInstance,
} from "wikibase/getWikibaseInstance";

import { WikiEntity } from "types/Entity";
import axios from "axios";

type getWikidataEntitiesProps = {
  ids: string[]; // ['Q1', 'Q2', 'Q3', ..., 'Q123']
  languages?: string[]; // ['en', 'fr', 'de']
  props?: string[]; // ['info', 'claims']
  wikibaseAlias?: WikibaseAlias;
};

type Response = Record<WikiEntity["id"], WikiEntity>;

export default async function getWikidataEntities({
  ids,
  languages = ["en"],
  props = ["labels", "descriptions", "claims", "sitelinks/urls"],
  wikibaseAlias = "wikidata",
}: getWikidataEntitiesProps): Promise<Response> {
  const wikibaseInstance = getWikibaseInstance(wikibaseAlias);

  if (ids.length === 0) {
    return {};
  }
  ids = ids.filter((id) => !!id); // delete undefined values

  // 1 url for every 50 items
  const urls: string[] = await new Promise((resolve, reject) => {
    try {
      resolve(
        wikibaseInstance.getManyEntities({
          ids,
          languages,
          props,
        }),
      );
    } catch (error) {
      reject(error);
    }
  });

  // responses will be based on the number of urls generated
  const responses = await axios.all(
    urls.map((url) => axios.get<any, { data: { entities: Response } }>(url)),
  );

  // merge all responses in one object
  let allentities: Response = {};
  responses.forEach(({ data: { entities } }) => {
    allentities = {
      ...allentities,
      ...entities,
    };
  });

  return allentities;
}
