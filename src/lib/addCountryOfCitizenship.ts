import { COUNTRIES } from "constants/countries";
import { COUNTRY_OF_CITIZENSHIP } from "constants/properties";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addCountryOfCitizenship(entity: Entity) {
  const countryId = getSimpleClaimValue(
    entity.simpleClaims,
    COUNTRY_OF_CITIZENSHIP,
  );

  if (!countryId) return;

  const country = COUNTRIES[countryId];

  if (country) {
    entity.countryOfCitizenship = country;
  }
}
