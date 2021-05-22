import { SimpleClaims } from "types/Entity";

export default function getSimpleClaimValue(
  simpleClaims: SimpleClaims | undefined,
  propId: string,
) {
  try {
    if (simpleClaims) return simpleClaims[propId][0].value;
  } catch (error) {
    return undefined;
  }
  return undefined;
}
