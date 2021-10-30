import { ALL_LANGS } from "constants/langs";

// keep compatibility
export interface Lang extends SecondLabel {
  code: LangCode;
  disambPageDesc: string;
}

export type SecondLabel = {
  code: string;
  name: string;
};

export type LangCode = keyof typeof ALL_LANGS;
