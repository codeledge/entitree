export declare type ClaimRank = "normal" | "preferred" | "deprecated";
export interface Claim {
  id: string;
  mainsnak: ClaimSnak;
  rank: ClaimRank;
  type: string;
  qualifiers?: Record<string, ClaimSnak[]>;
  "qualifiers-order"?: string[];
  references?: ClaimReference[];
}
export interface ClaimSnak {
  datatype: string;
  datavalue?: ClaimSnakValue;
  hash: string;
  property: string;
  snaktype: string;
}
export declare type ClaimSnakValue =
  | ClaimSnakTimeValue
  | ClaimSnakEntityValue
  | ClaimSnakTextValue;
export interface ClaimSnakTextValue {
  type: "monolingualtext";
  value: {
    text: string;
    language: string;
  };
}
export interface ClaimSnakTimeValue {
  type: "time";
  value: {
    after: number;
    before: number;
    calendermodel: string;
    precision: number;
    time: string;
    timezone: number;
  };
}
export interface ClaimSnakEntityValue {
  type: "wikibase-entityid";
  value: {
    id: string;
    "numeric-id": number;
    "entity-type": string;
  };
}
export interface ClaimReference {
  hash: string;
  snaks: Record<string, ClaimSnak[]>;
  "snaks-order": string[];
}
