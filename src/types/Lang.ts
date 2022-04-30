// keep compatibility
export interface Lang extends SecondLabel {
  code: LangCode;
  disambPageDesc: string;
}

export type SecondLabel = {
  code: LangCode;
  name: string;
};

export type LangCode = string; //keyof typeof ALL_LANGS; <= this, for some reason, becomes `string|number`
