import { COUNTRIES } from "constants/countries";
import { Entity } from "types/Entity";
import { WD_COUNTRY_OF_CITIZENSHIP } from "@entitree/helper";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addCountryOfCitizenship(entity: Entity) {
  const countryId = getSimpleClaimValue(
    entity.simpleClaims,
    WD_COUNTRY_OF_CITIZENSHIP,
  );

  if (!countryId) return;

  const country = COUNTRIES[countryId];

  if (country) {
    entity.countryOfCitizenship = country;
  }
}
