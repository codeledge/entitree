import { BigEntity } from "types/Entity";
import { WEBSITE_ID } from "constants/properties";

export default function addWebsite(entity: BigEntity) {
  entity.website = entity.simpleClaims?.[WEBSITE_ID][0].value;
}
