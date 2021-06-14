import { RELIGIONS } from "../constants/religions";

export default function religionByQid(id) {
  if (!id) {
    return null;
  }
  const entityId = id[0].value;
  const religion = RELIGIONS.find(
    (c) => c.item === "http://www.wikidata.org/entity/" + entityId,
  );
  if (!religion) {
    return null;
  }
  return religion;
}
