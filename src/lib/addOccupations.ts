import { Entity, SimpleClaim } from "types/Entity";

import { OCCUPATIONS } from "constants/occupations";
import { OCCUPATION_ID } from "constants/properties";
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
  console.log(occupations);
  if (!occupations) {
    return [];
  }
  const result: SparqlEmoji[] = [];
  occupations.forEach((occ) => {
    if (occ.value) {
      const search = OCCUPATIONS.find(
        (c) => c.item === "http://www.wikidata.org/entity/" + occ.value,
      );
      if (search) {
        result.push(search);
      }
    }
  });
  return result;
}
