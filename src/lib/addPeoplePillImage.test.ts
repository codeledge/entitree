import { Entity } from "types/Entity";
import { INSTANCE_OF_ID } from "constants/properties";
import addPeoplePillImage from "./addPeoplePillImage";
import getWikibaseEntities from "wikibase/getWikibaseEntities";

describe("addPeoplePillImage", () => {
  test("it should give the correct name", async () => {
    const id = "Q47122";
    const res = await getWikibaseEntities({
      ids: [id],
      dataSource: "wikidata",
    });

    const entity: Entity = {
      ...res[id],
      simpleClaims: {
        [INSTANCE_OF_ID]: [{ value: "Q5", qualifiers: {} }],
      },
    };

    addPeoplePillImage(entity);
    expect(entity.peoplepillSlug).toBe("enrique-iglesias");
  });
});
