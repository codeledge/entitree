// eslint-disable-next-line import/no-extraneous-dependencies
const buildSitemap = require("react-router-sitemap").sitemapBuilder;
const path = require("path");
// const fileName = process.argv[2];
const results = require("./spanish-father-child.json");
const fs = require("fs");

const FAMILY_TREE_TRANSLATIONS = {
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

const languageCode = "es";
// use your website root address here. Optimally you can
// include dev and production enviorenments with variables
const hostname = "https://www.entitree.com";

// define our destination folder and sitemap file name
const dest = path.resolve("./public", "sitemap-spain-father-child.xml");

const pages = ["/", "/about", "/privacy"];

console.log(FAMILY_TREE_TRANSLATIONS[languageCode]);

results.forEach(({ article }) => {
  pages.push(
    `/${languageCode}/${
      FAMILY_TREE_TRANSLATIONS[languageCode].replaceAll(" ","_")
    }/${decodeURI(article.replace(
      "https://" + languageCode + ".wikipedia.org/wiki/",
      "",
    ))}`,
  );
});

// Generate sitemap and return Sitemap instance
const sitemap = buildSitemap(hostname, pages);

// write sitemap.xml file in /public folder
// Access the sitemap content by converting it with .toString() method
fs.writeFileSync(dest, sitemap.toString());
