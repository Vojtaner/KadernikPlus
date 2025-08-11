import fs from "fs";
import path from "path";
import { load } from "cheerio";

if (process.argv.length < 3) {
  console.error("Usage: node create-key-and-json.js <filename.html>");
  process.exit(1);
}

const inputFile = process.argv[2];
const html = fs.readFileSync(inputFile, "utf8");
const $ = load(html, { decodeEntities: false });

// Tags to skip (script, style, noscript)
const skipTags = new Set(["script", "style", "noscript"]);

// To store extracted text keyed by generated keys
const translations = {};
let keyCount = 1;

function generateKey() {
  const baseName = path.basename(inputFile, path.extname(inputFile));
  return `${baseName}_key_${keyCount++}`;
}

// Recursive function to extract text nodes and replace with data-key attribute
function extractTextNodes(elem) {
  elem.contents().each((i, node) => {
    if (node.type === "text") {
      const text = node.data.trim();
      if (text.length > 0) {
        const parent = node.parent;
        // Skip if parent is in skipTags
        if (parent && !skipTags.has(parent.tagName)) {
          const key = generateKey();
          translations[key] = text;

          // Replace the text node with empty text
          node.data = "";

          // Add or update data-key attribute on parent element
          const $parent = $(parent);
          $parent.attr("data-key", key);
        }
      }
    } else if (node.type === "tag") {
      // Recurse for element nodes, except skipTags
      if (!skipTags.has(node.tagName)) {
        extractTextNodes($(node));
      }
    }
  });
}

// Start extraction from body (or root if no body)
const root = $("body").length ? $("body") : $.root();
extractTextNodes(root);

const outHtml = $.html();
const outHtmlFile = inputFile;

// Create lang folder if not exists
const langDir = path.join(path.dirname(inputFile), "assets", "lang");
if (!fs.existsSync(langDir)) {
  fs.mkdirSync(langDir, { recursive: true });
}

// Build JSON filename with suffix "-cs.json"
const baseName = path.basename(inputFile, path.extname(inputFile));
const jsonFile = path.join(langDir, `${baseName}-cs.json`);

// Write modified HTML with data-key attributes
fs.writeFileSync(outHtmlFile, outHtml, "utf8");

// Write translations JSON inside assets/lang/
fs.writeFileSync(jsonFile, JSON.stringify(translations, null, 2), "utf8");

console.log(`Extraction complete.
Modified HTML saved to: ${outHtmlFile}
Translation JSON saved to: ${jsonFile}`);
