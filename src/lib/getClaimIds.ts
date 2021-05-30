import { Entity, SimpleClaim } from "types/Entity";

// Claims may have qualifier series ordinal,
// this should be set when the children birthdate is unknown,
// but they should still be sorted by age.
function getSeriesOrdinal(claim: SimpleClaim) {
  if (claim?.qualifiers?.P1545?.[0]) {
    return parseInt(claim.qualifiers.P1545[0], 10);
  }
  // const {
  //   qualifiers: {
  //     P1545: [{
  //       datavalue: { value: seriesOrdinal },
  //     }],
  //   },
  // } = claim;
  // return parseInt(seriesOrdinal);
  return 0;
}

export default function getClaimIds(entity: Entity, propId: string) {
  const simpleClaimSet = entity.simpleClaims?.[propId] || [];
  simpleClaimSet.sort((a, b) => {
    return getSeriesOrdinal(a) - getSeriesOrdinal(b);
  });
  return simpleClaimSet.map(({ value }) => value).filter((c) => c); // filter out 'No value' and 'Unknown'
}

// checks whether the claim has a qualifier of series ordinal, return true if the first one has it
export function checkIfClaimsHasSeriesOrdinal(entity: Entity, propId: string) {
  const simpleClaimSet = entity.simpleClaims?.[propId] || [];
  if (simpleClaimSet.length) {
    if (getSeriesOrdinal(simpleClaimSet[0])) {
      return true;
    }
  }
  return false;
}
