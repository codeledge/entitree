import { LANG_MAP } from "constants/langs";

export type Lang = {
  code: LangCode;
  name: string;
  disambPageDesc: string;
};

export type LangCode = keyof typeof LANG_MAP;
