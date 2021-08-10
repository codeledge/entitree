import { Claim } from "types/Claim";

export function getTimeQualifier(claim: Claim, qualifierId: string) {
  try {
    return claim.qualifiers?.[qualifierId][0].datavalue?.value["time"];
  } catch (error) {
    return undefined;
  }
}
