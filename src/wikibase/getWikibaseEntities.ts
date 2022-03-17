import { DataSource, getWikibaseInstance } from "wikibase/getWikibaseInstance";

import { WikibaseEntity } from "types/Entity";
import axios from "axios";

type GetWikibaseEntitiesProps = {
  ids: string[]; // ['Q1', 'Q2', 'Q3', ..., 'Q123']
  languages?: string[]; // ['en', 'fr', 'de']
  props?: string[]; // ['info', 'claims']
  dataSource: DataSource;
};

type WikibaseEntityMap = Record<WikibaseEntity["id"], WikibaseEntity>;

export default async function getWikibaseEntities({
  ids,
  languages = ["en"],
  props = ["labels", "descriptions", "claims", "sitelinks/urls"],
  dataSource,
}: GetWikibaseEntitiesProps): Promise<WikibaseEntityMap> {
  const wikibaseInstance = getWikibaseInstance(dataSource);

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
    urls.map((url) =>
      axios.get<any, { data: { entities: WikibaseEntityMap } }>(url),
    ),
  );

  // merge all responses in one object
  let allentities: WikibaseEntityMap = {};
  responses.forEach(({ data: { entities } }) => {
    allentities = {
      ...allentities,
      ...entities,
    };
  });

  return allentities;
}
