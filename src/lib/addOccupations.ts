import { Entity, SimpleClaim } from "types/Entity";

import { OCCUPATION_ID } from "constants/properties";
import { OCCUPATION_MAP } from "constants/occupations";
import { SparqlEmoji } from "types/SparqlEmoji";

export default function addOccupations(entity: Entity) {
  const occs = entity.simpleClaims?.[OCCUPATION_ID];
  if (occs !== undefined) {
    const emojis = getEmojisByOccupations(entity.simpleClaims?.[OCCUPATION_ID]);
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
