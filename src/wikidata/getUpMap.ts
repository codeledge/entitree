import axios from "axios";
import wdk from "wikidata-sdk";

//TODO: release cache after a while
const cache = {};

export default async function getUpMap(itemId: string, propId: string) {
  const cacheKey = itemId + propId;
  const cacheEl = cache[cacheKey];
  if (cacheEl) {
    return cacheEl;
  }
  const query = `
  SELECT DISTINCT ?source ?target WHERE {
    SERVICE gas:service {
      gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
        gas:in wd:${itemId};
        gas:traversalDirection "Reverse" ;
        gas:out ?target;
        gas:out1 ?depth;
        gas:out2 ?source;
        gas:linkType wdt:${propId}.
    }
  }
  ORDER BY ?depth
  `.trim();

  //console.log(query);

  const url = wdk.sparqlQuery(query);

  return axios
    .get(url)
    .then(({ data }) => wdk.simplify.sparqlResults(data).slice(1))
    .then((rows) => {
      //TODO: type
      const targetMap = {};
      rows.forEach(({ source, target }) => {
        if (!targetMap[source]) targetMap[source] = [];
        //leave out lexemes
        if (target.startsWith("Q")) targetMap[source].push(target);
      });

      cache[cacheKey] = targetMap;
      return targetMap;
    });
}

// function getDescendantsMap(id, propId) {
//   const query = `
//   SELECT DISTINCT ?source ?target WHERE {
//     SERVICE gas:service {
//       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
//         gas:in wd:${id};
//         gas:out ?target;
//         gas:out1 ?depth;
//         gas:out2 ?source;
//         gas:linkType wdt:${propId}.
//     }
//   }
//   ORDER BY ?depth
// `.trim();

//   //console.log(query);

//   const url = wdk.sparqlQuery(query);

//   return getData(url).then((data) => wdk.simplify.sparqlResults(data).slice(1));
// }
