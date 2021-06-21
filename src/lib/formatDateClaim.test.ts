import { Claim } from "types/Claim";
import formatDateClaim from "./formatDateClaim";

test("JESUS birth date", () => {
  const claim = ([
    {
      mainsnak: {
        datavalue: {
          value: {
            calendarmodel: "http://www.wikidata.org/entity/Q1985786",
            precision: 9,
            time: "-0007-00-00T00:00:00Z",
            timezone: 0,
          },
        },
      },
      rank: "normal",
    },
    {
      mainsnak: {
        datavalue: {
          type: "time",
          value: {
            calendarmodel: "http://www.wikidata.org/entity/Q1985786",
            precision: 9,
            time: "-0002-00-00T00:00:00Z",
            timezone: 0,
          },
        },
      },
      rank: "normal",
    },
  ] as unknown) as Claim[];
  const formatted = formatDateClaim(claim, "en");
  expect(formatted).toBe("7 BCE");
});

test("JESUS death date", () => {
  const claim = ([
    {
      mainsnak: {
        datavalue: {
          value: {
            calendarmodel: "http://www.wikidata.org/entity/Q1985786",
            precision: 9,
            time: "+0030-00-00T00:00:00Z",
            timezone: 0,
          },
        },
      },
      rank: "normal",
    },
    {
      mainsnak: {
        datavalue: {
          value: {
            calendarmodel: "http://www.wikidata.org/entity/Q1985786",
            precision: 9,
            time: "+0033-00-00T00:00:00Z",
            timezone: 0,
          },
        },
      },
      rank: "normal",
    },
  ] as unknown) as Claim[];
  const formatted = formatDateClaim(claim, "en");
  expect(formatted).toBe("30");
});

test("NAPOLEON birth date deprecated first", () => {
  const claim = ([
    {
      mainsnak: {
        snaktype: "value",
        property: "P569",
        hash: "814b99d578fd438aebbb60cf21c01de74d993566",
        datavalue: {
          value: {
            time: "+1769-01-01T00:00:00Z",
            timezone: 0,
            before: 0,
            after: 0,
            precision: 9,
            calendarmodel: "http://www.wikidata.org/entity/Q1985727",
          },
          type: "time",
        },
        datatype: "time",
      },
      type: "statement",
      id: "Q517$53576E73-CB76-4960-BEC1-1934DB266963",
      rank: "deprecated",
    },
    {
      mainsnak: {
        snaktype: "value",
        property: "P569",
        hash: "cb855fb606e5ac1fc1a7342973f5b73c3dd08919",
        datavalue: {
          value: {
            time: "+1769-08-15T00:00:00Z",
            timezone: 0,
            before: 0,
            after: 0,
            precision: 11,
            calendarmodel: "http://www.wikidata.org/entity/Q1985727",
          },
          type: "time",
        },
        datatype: "time",
      },
      type: "statement",
      rank: "normal",
    },
  ] as unknown) as Claim[];
  const formatted = formatDateClaim(claim, "en");
  expect(formatted).toBe("15 Aug 1769");
});

test("test born in the 20th century", () => {
  const claim = ([
    {
      mainsnak: {
        snaktype: "value",
        property: "P569",
        hash: "45fa3edcac7fab894cee68fb6704dc9c13de3261",
        datavalue: {
          value: {
            time: "+2000-01-01T00:00:00Z",
            timezone: 0,
            before: 0,
            after: 0,
            precision: 7,
            calendarmodel: "http://www.wikidata.org/entity/Q1985727",
          },
          type: "time",
        },
        datatype: "time",
      },
      type: "statement",
      id: "Q15840139$55B101EE-CBF7-4117-A2C2-84E6D72A273B",
      rank: "normal",
    },
  ] as unknown) as Claim[];
  const formatted = formatDateClaim(claim, "en");
  expect(formatted).toBe("20th cent.");
});

test("1940s", () => {
  const claim = ([
    {
      mainsnak: {
        snaktype: "value",
        property: "P569",
        hash: "a50d5838fbddc159755964cc3ce72426cabf5deb",
        datavalue: {
          value: {
            time: "+1945-00-00T00:00:00Z",
            timezone: 0,
            before: 0,
            after: 0,
            precision: 8,
            calendarmodel: "http://www.wikidata.org/entity/Q1985727",
          },
          type: "time",
        },
        datatype: "time",
      },
      type: "statement",
      id: "Q35723119$d9342525-4d64-b1d7-b2e9-88e734c2c5a8",
      rank: "normal",
    },
  ] as unknown) as Claim[];
  const formatted = formatDateClaim(claim, "en");
  expect(formatted).toBe("1940s");
});
