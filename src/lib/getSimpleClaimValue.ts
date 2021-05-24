/* eslint-disable no-empty */
/* eslint-disable consistent-return */
import { SimpleClaims } from "types/Entity";

export default function getSimpleClaimValue(
  simpleClaims: SimpleClaims | undefined,
  propId: string,
) {
  try {
    return simpleClaims?.[propId][0].value;
  } catch (error) {}
}
