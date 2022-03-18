import { Entity, SimpleClaim } from "types/Entity";
import { OCCUPATION_MAP, WD_OCCUPATION } from "@entitree/helper";

import { SparqlEmoji } from "types/SparqlEmoji";

export default function addOccupations(entity: Entity) {
  const occs = entity.simpleClaims?.[WD_OCCUPATION];
  if (occs !== undefined) {
    const emojis = getEmojisByOccupations(entity.simpleClaims?.[WD_OCCUPATION]);
    entity.occupations = emojis;
  }
}
function getEmojisByOccupations(
  occupations: SimpleClaim[] | undefined,
): SparqlEmoji[] {
  // const occupations = entity.simpleClaims?.[OCCUPATION_ID];
  if (!occupations) {
    return [];
  }

  return occupations.reduce((sparqlEmojis: SparqlEmoji[], occupation) => {
    if (occupation.value) {
      const occupationEmoji =
        OCCUPATION_MAP["http://www.wikidata.org/entity/" + occupation.value];
      if (occupationEmoji) return sparqlEmojis.concat(occupationEmoji);
    }
    return sparqlEmojis;
  }, []);
}
