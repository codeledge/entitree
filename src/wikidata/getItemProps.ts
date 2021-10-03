import { CHILD_ID, FAMILY_IDS_MAP } from "constants/properties";
import { DEFAULT_LANG, FAMILY_TREE_TRANSLATIONS } from "constants/langs";
import {
  WikibaseAlias,
  getWikibaseInstance,
} from "wikibase/getWikibaseInstance";

import { EntityProp } from "types/Entity";
import { LangCode } from "types/Lang";
import axios from "axios";

export default async function getItemProps(
  id: string,
  langCode: LangCode,
  wikibaseAlias: WikibaseAlias,
) {
  const wbk = getWikibaseInstance(wikibaseAlias);

  const url = await new Promise<string>((resolve, reject) => {
    try {
      const query = `
      SELECT DISTINCT ?prop ?propLabel WHERE {
        BIND(wd:${id} as ?item)
        {
          ?item ?p ?child.
          ?prop wikibase:claim ?p;
            wikibase:propertyType wikibase:WikibaseItem.
        }
        UNION
        {
          ?parent ?p ?item.
          ?prop wikibase:directClaim ?p.
          MINUS { ?parent rdf:type ?pt. }
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${langCode}, ${
        DEFAULT_LANG!.code
      }". }
      }`.trim();

      const url = wbk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return axios
    .get(url)
    .then(({ data }) => wbk.simplify.sparqlResults(data))
    .then((results) => {
      const props: EntityProp[] = results.reduce(
        (filteredProps, { prop: { value: id, label } }) => {
          const thisProp: EntityProp = {
            id,
            label,
            slug: label.replace(/\s/g, "_"),
          };
          if (FAMILY_IDS_MAP[id]) {
            // filter out mother/siblings etc props
            if (id !== CHILD_ID) return filteredProps;

            thisProp.isFav = true;

            //label is "child", you want "family tree" if available
            const translatedFamilyTree = FAMILY_TREE_TRANSLATIONS[langCode];

            if (translatedFamilyTree) {
              thisProp.overrideLabel = translatedFamilyTree;
              thisProp.slug = translatedFamilyTree.replace(/\s/g, "_");
            }

            //put it at the top
            return [thisProp, ...filteredProps];
          }

          return [...filteredProps, thisProp];
        },
        [],
      );
      return props;
    });
}
