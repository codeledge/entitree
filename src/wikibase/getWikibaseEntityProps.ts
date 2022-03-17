import { DEFAULT_LANG, FAMILY_TREE_PROP_TRANSLATIONS } from "constants/langs";
import { DataSource, getWikibaseInstance } from "wikibase/getWikibaseInstance";

import { EntityProp } from "types/Entity";
import { LangCode } from "types/Lang";
import axios from "axios";
import { errorHandler } from "handlers/errorHandler";
import getWikibaseConstants from "./getWikibaseConstants";

export default async function getWikibaseEntityProps(
  id: string,
  langCode: LangCode,
  dataSource: DataSource,
) {
  const wbk = getWikibaseInstance(dataSource);

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

  const { FAMILY_IDS_MAP, WD_CHILD } = getWikibaseConstants(dataSource);

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
            if (id !== WD_CHILD) return filteredProps;

            thisProp.isFav = true;

            //label is "child", you want "family tree" if available
            const translatedFamilyTree =
              FAMILY_TREE_PROP_TRANSLATIONS[langCode];

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
    })
    .catch((err) => {
      errorHandler(err);
      return [];
    });
}
