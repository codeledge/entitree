export const PROPERTY_LIST = {
  P40: {
    symbol: "treeSymbol",
    name: "familyTree",
  },
};
export const PROPERTY_INSTANCE_MAPPING = [
  {
    id: ["Q5"], // human
    properties: [
      "P40", // child
      // mentor
    ],
  },
  {
    id: [
      "Q4830453",
      "Q43229", // organization
    ],
    properties: [
      "P355", // subsidiary
      "P749", // parent organization
      "P1830", // owner of
      "P127", // owned by
    ],
  },
  {
    id: [
      "Q486972", // human settlement and what is a subclass of it
    ],
    properties: [
      "P131", // located in admin region
    ],
  },
];
