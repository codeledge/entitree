import addPeoplePillImage from "./addPeoplePillImage";
import formatEntity from "./formatEntity";
import getWikidataEntities from "../wikidata/getWikidataEntities";

describe("addPeoplePillImage", () => {
  test("it should give the correct name", async () => {
    const id = "Q47122";
    const res = await getWikidataEntities({ ids: [id] });
    const entity = formatEntity(res[id], "en");

    console.log(entity);

    // addPeoplePillImage(entity);
    // expect(res[id].id).toBe("enrique-iglesias");
  });
});
