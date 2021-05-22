import { Entity } from "wikibase-types/dist";
import axios from "axios";
import wdk from "wikidata-sdk";

type getWikidataEntitiesProps = {
  ids: string[]; // ['Q1', 'Q2', 'Q3', ..., 'Q123']
  languages?: string[]; // ['en', 'fr', 'de']
  props?: string[]; // ['info', 'claims']
};

type EntityResponse = Record<Entity["id"], Entity>;
export default async function getWikidataEntities({
  ids,
  languages = ["en"],
  props = ["labels", "descriptions", "claims", "sitelinks/urls"],
}: getWikidataEntitiesProps): Promise<EntityResponse> {
  if (ids.length === 0) {
    return {};
  }
  ids = ids.filter((id) => !!id); // delete undefined values

  // 1 url for every 50 items
  const urls: string[] = await new Promise((resolve, reject) => {
    try {
      if (!languages) throw new Error("languageCode Missing");
      resolve(
        wdk.getManyEntities({
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
      axios.get<any, { data: { entities: EntityResponse } }>(url),
    ),
  );

  // merge all responses in one object
  let allentities: EntityResponse = {};
  responses.forEach(({ data: { entities } }) => {
    allentities = {
      ...allentities,
      ...entities,
    };
  });

  return allentities;
}
