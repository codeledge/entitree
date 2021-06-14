import { COUNTRIES } from "constants/countries";
import { COUNTRY_OF_CITIZENSHIP } from "constants/properties";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addCountryOfCitizenship(entity: Entity) {
  const countryId = getSimpleClaimValue(
    entity.simpleClaims,
    COUNTRY_OF_CITIZENSHIP,
  );

  const country = COUNTRIES.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + countryId,
  );

  if (country) {
    country.text = "Citizen of " + country.name + " (Wikidata)";
    entity.countryOfCitizenship = country;
  }
}
