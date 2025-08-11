import fs from "fs";
import path from "path";
import { load } from "cheerio";

const srcDir = "lonyo"; // folder with your HTML files
const texts = {};

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith(".html")) {
    const html = fs.readFileSync(path.join(srcDir, file), "utf8");
    const $ = load(html);

    $("*")
      .contents()
      .each((_, node) => {
        if (node.type === "text") {
          const text = $(node).text().trim();
          if (text && !/^(\s*|\d+)$/.test(text)) {
            const key = `${file.replace(".html", "")}_${
              Object.keys(texts).length + 1
            }`;
            texts[key] = text;
          }
        }
      });
  }
});

fs.writeFileSync("texts.json", JSON.stringify(texts, null, 2), "utf8");
console.log("Extracted texts into texts.json");
