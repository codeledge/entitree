import {
  Claim,
  ClaimSnakEntityValue,
  ClaimSnakTextValue,
  ClaimSnakValue,
} from "types/Claim";

export function getBestClaim(claims: Claim[]): Claim | undefined {
  if (!claims) return;

  const cleanClaims: Claim[] = [];
  claims.forEach((c) => {
    if (c.rank === "normal") cleanClaims.push(c);
    if (c.rank === "preferred") cleanClaims.unshift(c);

    // What about the deprecated ones?
  });

  const bestClaim = cleanClaims[0];

  return bestClaim;
}

export function getBestClaimValue(
  claims: Claim[],
): ClaimSnakValue["value"] | undefined {
  if (!claims) return;

  const bestClaim = getBestClaim(claims);

  const bestClaimValue = bestClaim?.mainsnak.datavalue?.value;

  return bestClaimValue;
}

export function getBestClaimValueId(
  claims: Claim[],
): ClaimSnakEntityValue["value"]["id"] | undefined {
  if (!claims) return;

  const bestClaimValue = getBestClaimValue(
    claims,
  ) as ClaimSnakEntityValue["value"];

  return bestClaimValue?.id;
}

export function getBestClaimValueText(claims: Claim[]): string | undefined {
  if (!claims) return;
  const bestClaimValue = getBestClaimValue(
    claims,
  ) as ClaimSnakTextValue["value"];

  return bestClaimValue?.text;
}
