import fs from "fs";
import path from "path";
import { load } from "cheerio";

if (process.argv.length < 3) {
  console.error("Usage: node insert-translation.js <html-file> [<json-file>]");
  process.exit(1);
}

const htmlFile = process.argv[2];
let jsonFile = process.argv[3];

if (!jsonFile) {
  const baseName = path.basename(htmlFile, path.extname(htmlFile)); // strips extension
  const dirName = path.dirname(htmlFile);
  jsonFile = path.join(dirName, "assets", "lang", `${baseName}-cs.json`);
}

// Now read files
const html = fs.readFileSync(htmlFile, "utf8");
const translations = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
const $ = load(html, { decodeEntities: false });

$("[data-key]").each((_, el) => {
  const $el = $(el);
  const key = $el.attr("data-key");
  if (key && translations[key]) {
    $el.text(translations[key]);
  }
});

fs.writeFileSync(htmlFile, $.html(), "utf8");

console.log(`Translations inserted into HTML and saved as: ${htmlFile}`);
