import { Lang, LangCode } from "types/Lang";

import { ALL_LANGS } from "@entitree/helper";

const DISAMBIGUATION_PAGE_DESC = {
  en: "Wikimedia disambiguation page",
  de: "Wikimedia-Begriffsklärungsseite",
  da: "Wikipedia-flertydigside",
  es: "página de desambiguación de Wikimedia",
  fr: "page d'homonymie de Wikimedia",
  id: "halaman disambiguasi Wikimedia",
  it: "pagina di disambiguazione di un progetto Wikimedia",
  ja: "ウィキメディアの曖昧さ回避ページ",
  ar: "صفحة توضيح لويكيميديا",
  hi: "बहुविकल्पी पृष्ठ",
  hu: "egyértelműsítő lap",
  nl: "Wikimedia-doorverwijspagina",
  pl: "strona ujednoznaczniająca",
  pt: "página de desambiguação de um projeto da Wikimedia",
  ru: "страница значений в проекте Викимедиа",
  zh: "維基媒體消歧義頁",
  ne: "------",
};

export const LANGS = Object.keys(ALL_LANGS).map((code) => {
  return {
    code,
    name: ALL_LANGS[code],
    disambPageDesc: DISAMBIGUATION_PAGE_DESC[code],
  } as Lang;
});

export const DEFAULT_LANG_CODE = "en";

export const DEFAULT_LANG = LANGS.find(
  (lang) => lang.code === DEFAULT_LANG_CODE,
)!;

//TODO This "could" match all supported langs, so changing lang doesn't need a reload
//Fetch always langs that have disambig page translation (main languages)
export const DEFAULT_LANGS_CODES: LangCode[] = Object.keys(
  DISAMBIGUATION_PAGE_DESC,
) as LangCode[];

export const FAMILY_TREE_PROP_TRANSLATIONS = {
  "zh-hans": "家族树",
  "zh-hant": "家族樹",
  "zh-hk": "家族樹",
  "zh-cn": "家族树",
  "zh-sg": "家族树",
  "zh-tw": "家族樹",
  pl: "Drzewo genealogiczne",
  eu: "Zuhaitz genealogiko",
  es: "árbol genealógico",
  or: "ବଂଶାବଳୀ",
  hu: "családfa",
  ms: "Salasilah keluarga",
  it: "albero genealogico",
  et: "Sugupuu",
  de: "Stammbaum",
  id: "Bagan silsilah",
  br: "Gwezenn-gerentiezh",
  el: "Γενεαλογικό δέντρο",
  sh: "Obiteljsko stablo",
  ar: "شجرة العائلة",
  sv: "Släktträd",
  nl: "stamboom",
  pt: "árvore genealógica",
  eo: "genealogia arbo",
  sk: "Rodokmeň",
  ru: "генеалогическое древо",
  tt: "Шәҗәрә",
  en: "family tree",
  tr: "Soy ağacı",
  ro: "Arbore genealogic",
  ca: "arbre genealògic",
  fi: "Sukupuu",
  cy: "Coeden deulu",
  sl: "Družinsko drevo",
  cs: "rodokmen",
  fa: "تبارنامه",
  hr: "Obiteljsko stablo",
  "kk-arab": "گەنەالوگىييالىك اعاش",
  "kk-cn": "گەنەالوگىييالىك اعاش",
  "kk-tr": "Genealogïyalık ağaş",
  "kk-kz": "Генеалогиялык ағаш",
  "kk-cyrl": "Генеалогиялык ағаш",
  "kk-latn": "Genealogïyalık ağaş",
  da: "Efterslægtstavle",
  ko: "가계도",
  kk: "Генеалогиялык ағаш",
  sah: "Төрүччү",
  zh: "谱系图",
  gl: "Árbore xenealóxica",
  bn: "কুলজিনামা",
  uk: "Генеалогічне дерево",
  ta: "குடும்ப மரம்",
  fr: "arbre généalogique",
  sr: "породично стабло",
  "sr-ec": "породично стабло",
  "sr-el": "porodično stablo",
  lv: "Ciltskoks",
  sco: "faimily tree",
  az: "Nəsil şəcərəsi",
  ja: "系図",
  hi: "वंशावली",
  he: "אילן יוחסין",
  la: "Arbor familiaris",
  nb: "stamtre",
  hyw: "Տոհմածառ",
  hy: "տոհմածառ",
  vro: "Sugupuu",
};
