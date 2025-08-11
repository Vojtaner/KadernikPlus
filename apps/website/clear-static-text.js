import fs from "fs";
import path from "path";
import { load } from "cheerio";

const srcDir = "lonyo";
const outDir = "lonyo";

const content = JSON.parse(
  fs.readFileSync("./lonyo/assets/lang/cs.json", "utf8")
);

fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith(".html")) {
    const filePath = path.join(srcDir, file);
    const html = fs.readFileSync(filePath, "utf8");
    const $ = load(html);

    $("[data-key]").each((_, el) => {
      const key = $(el).attr("data-key");
      if (content[key]) {
        $(el).text(content[key]);
      }
    });

    const outPath = path.join(outDir, file);
    fs.writeFileSync(outPath, $.html(), "utf8");
    console.log(`Processed ${file}`);
  }
});
