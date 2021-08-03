import { SparqlEmoji } from "types/SparqlEmoji";

export const RELIGIONS: SparqlEmoji[] = [
  {
    item: "http://www.wikidata.org/entity/Q1458238",
    itemLabel: "United Reformed Church",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q5043",
    itemLabel: "Christianity",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q234953",
    itemLabel: "Shaivism",
    emoji: "🕉",
  },
  {
    item: "http://www.wikidata.org/entity/Q3333484",
    itemLabel: "Eastern Orthodoxy",
    emoji: "☦",
  },
  {
    item: "http://www.wikidata.org/entity/Q432",
    itemLabel: "Islam",
    emoji: "☪",
  },
  {
    item: "http://www.wikidata.org/entity/Q391951",
    itemLabel: "Protestant Church in the Netherlands",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q349849",
    itemLabel: "East Asian Yogācāra",
    emoji: "☸",
  },
  {
    item: "http://www.wikidata.org/entity/Q132265",
    itemLabel: "Theravada",
    emoji: "☸",
  },
  {
    item: "http://www.wikidata.org/entity/Q170208",
    itemLabel: "Religious Society of Friends",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q9316",
    itemLabel: "Sikhism",
    emoji: "☬",
  },
  {
    item: "http://www.wikidata.org/entity/Q201620",
    itemLabel: "Waldensians",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q174495",
    itemLabel: "tawḥīd",
    emoji: "☪",
  },
  {
    item: "http://www.wikidata.org/entity/Q346575",
    itemLabel: "evangelical church",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q198745",
    itemLabel: "United Church of Canada",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q159318",
    itemLabel: "Moravian Church",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q165580",
    itemLabel: "anabaptism",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q585110",
    itemLabel: "Restoration Movement",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q523620",
    itemLabel: "Uniting Church in Australia",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q666614",
    itemLabel: "The Christian Community",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q1149100",
    itemLabel: "Presbyterian Church (U.S.A.)",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q9089",
    itemLabel: "Hinduism",
    emoji: "🕉",
  },
  {
    item: "http://www.wikidata.org/entity/Q922480",
    itemLabel: "Church of Scotland",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q859557",
    itemLabel: "Liberal Christianity",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q369557",
    itemLabel: "Methodist Episcopal Church",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q48362",
    itemLabel: "Mahayana",
    emoji: "☸",
  },
  {
    item: "http://www.wikidata.org/entity/Q188307",
    itemLabel: "The Salvation Army",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q1841",
    itemLabel: "Catholicism",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q748",
    itemLabel: "Buddhism",
    emoji: "☸",
  },
  {
    item: "http://www.wikidata.org/entity/Q855941",
    itemLabel: "Restorationism",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q1814867",
    itemLabel: "Imamiyyah",
    emoji: "☪",
  },
  {
    item: "http://www.wikidata.org/entity/Q2347115",
    itemLabel: "Q2347115",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q9585",
    itemLabel: "Shia Islam",
    emoji: "☪",
  },
  {
    item: "http://www.wikidata.org/entity/Q9268",
    itemLabel: "Judaism",
    emoji: "✡",
  },
  {
    item: "http://www.wikidata.org/entity/Q10503732",
    itemLabel: "Uniting Church in Sweden",
    emoji: "✝",
  },
  {
    item: "http://www.wikidata.org/entity/Q35032",
    itemLabel: "Eastern Orthodox Church",
    emoji: "☦",
  },
  {
    item: "http://www.wikidata.org/entity/Q23540",
    itemLabel: "Protestantism",
    emoji: "✝",
  },
];

//https://query.wikidata.org/#%23Religion%0ASELECT%20DISTINCT%20%3Fitem%20%3FitemLabel%20%20%3Femoji%0AWHERE%20%0A%7B%0A%20%20%7B%20%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ13414953.%7D%0A%20%20UNION%0A%20%20%7B%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ9174.%7D%0A%20%20.%0A%20%20%7B%20%3Fitem%20wdt%3AP487%20%3Femoji%20.%7D%0A%20%20UNION%0A%20%20%7B%20%3Fitem%20wdt%3AP361%20%3FpartOf.%20%23use%20emoji%20of%20greater%20group%0A%20%20%20%20%3FpartOf%20wdt%3AP487%20%3Femoji%20.%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%7D%0A%7D
