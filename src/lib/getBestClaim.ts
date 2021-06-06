import { Claim } from "types/Claim";

export default function getBestClaim(claim: Claim[], prop = "id"): string {
  if (!claim) return "";

  const cleanClaims: Claim[] = [];
  claim.forEach((c) => {
    if (c.mainsnak.datavalue?.value[prop]) {
      if (c.rank === "normal") cleanClaims.push(c);
      if (c.rank === "preferred") cleanClaims.unshift(c);

      // What about the deprecated ones?
    }
  });

  const bestClaim = cleanClaims[0];

  return bestClaim?.mainsnak.datavalue?.value?.[prop] || "";
}
