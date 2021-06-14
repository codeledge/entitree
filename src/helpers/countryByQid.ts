import { COUNTRIES } from "../constants/countries";

export default function countryByQid(id) {
  if (!id) {
    return null;
  }
  const entityId = id[0].value;
  const country = COUNTRIES.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + entityId,
  );
  if (!country) {
    return null;
  }

  country.text = "Citizen of " + country.name + " (Wikidata)";
  return country;
}
