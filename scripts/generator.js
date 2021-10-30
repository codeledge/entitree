// eslint-disable-next-line import/no-extraneous-dependencies
const buildSitemap = require("react-router-sitemap").sitemapBuilder;
const path = require("path");
// const fileName = process.argv[2];
const results = require("./sparql/spanish-father-child.json");
const fs = require("fs");

const languageCode = "es";
// use your website root address here. Optimally you can
// include dev and production enviorenments with variables
const hostname = "https://www.entitree.com";

// define our destination folder and sitemap file name
const dest = path.resolve("./public", "sitemap-spain-father-child.xml");

const pages = ["/", "/about", "/privacy"];

results.forEach(({ article }) => {
  pages.push(
    `/${languageCode}/árbol_genealógico/${decodeURI(
      article.replace("https://" + languageCode + ".wikipedia.org/wiki/", ""),
    )}`,
  );
});

// Generate sitemap and return Sitemap instance
const sitemap = buildSitemap(hostname, pages);

// write sitemap.xml file in /public folder
// Access the sitemap content by converting it with .toString() method
fs.writeFileSync(dest, sitemap.toString());
