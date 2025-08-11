import fs from "fs";
import path from "path";
import { load } from "cheerio";

const translations = JSON.parse(fs.readFileSync("en.json", "utf8"));
const srcDir = "lonyo";
const outDir = "tagged";

fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith(".html")) {
    const html = fs.readFileSync(path.join(srcDir, file), "utf8");
    const $ = load(html);

    Object.entries(translations).forEach(([key, value]) => {
      $(`*:contains("${value}")`).each((_, el) => {
        const elText = $(el).text().trim();
        if (elText === value && !$(el).attr("data-key")) {
          $(el).attr("data-key", key);
        }
      });
    });

    fs.writeFileSync(path.join(outDir, file), $.html(), "utf8");
  }
});

console.log("Tagged HTML saved in:", outDir);
