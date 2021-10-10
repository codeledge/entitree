// import { SecondLabel } from "types/Lang";

export const INSTANCE_OF_ID = "P2";

// export const BIRTH_DATE_ID = "P569";
// export const BIRTH_NAME_ID = "P1477";
// export const BIRTH_PLACE_ID = "P19";
export const CHILD_ID = "P150";
// export const COUNTRY_OF_CITIZENSHIP = "P27";
// export const DEATH_DATE_ID = "P570";
// export const DEATH_PLACE_ID = "P20";
// export const DISSOLVED_ABOLISHED_DEMOLISHED_ID = "P576";
// export const END_DATE_ID = "P582";
// export const EYE_COLOR_ID = "P1340";
// export const FANDOM_ARTICLE_ID = "P6262";
export const FATHER_ID = "P141";
export const GENDER_ID = "P154";
// export const GENI_ID = "P2600";
// export const HAIR_COLOR_ID = "P1884";
export const IMAGE_ID = "P189";
// export const INCEPTION_ID = "P571";
// export const INSTAGRAM_ID = "P2003";
// export const LANGUAGE_OF_WORK_ID = "P407";
// export const LOCATED_IN_ID = "P131";
// export const LOGO_ID = "P154";
export const MOTHER_ID = "P142";
// export const NAME_IN_KANA_ID = "P1814";
// export const NICKNAME_ID = "P1449";
// export const NUMBER_OF_CHILDREN_ID = "P1971";
// export const OCCUPATION_ID = "P106";
// export const PARTNER_ID = "P451"; // unmarried partner
// export const RELIGION_ID = "P140";
// export const SIBLINGS_ID = "P3373";
// export const SOURCING_CIRCUMSTANCES_ID = "P1480";
export const SPOUSE_ID = "P84";
// export const START_DATE_ID = "P580";
// export const STUDENT_ID = "P802";
// export const STUDENT_OF_ID = "P1066";
// export const TWITTER_ID = "P2002";
// export const WEBSITE_ID = "P856";
// export const WIKITREE_ID = "P2949";

export const FAMILY_IDS_MAP = {
  [CHILD_ID]: true,
  // [SIBLINGS_ID]: true,
  [SPOUSE_ID]: true,
  [FATHER_ID]: true,
  [MOTHER_ID]: true,
};

export const FAMILY_TREE_PROP = {
  id: CHILD_ID,
  slug: "family_tree",
  label: "child",
  overrideLabel: "family tree",
  isFav: true,
};

export const RIGHT_ENTITY_OPTIONS = [
  {
    propIds: [],
    title: "Nothing",
  },
  {
    propIds: [SPOUSE_ID],
    title: "Only spouses",
  },
];
