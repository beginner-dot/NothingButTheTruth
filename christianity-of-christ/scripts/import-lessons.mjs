import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content", "modules");
const output = [];

for (const moduleId of fs.readdirSync(root)) {
  const modulePath = path.join(root, moduleId);
  if (!fs.statSync(modulePath).isDirectory()) continue;
  for (const fileName of fs.readdirSync(modulePath)) {
    if (fileName.endsWith(".mdx")) {
      output.push({ moduleId, fileName, path: path.join("content", "modules", moduleId, fileName) });
    }
  }
}

console.log(`Discovered ${output.length} lesson files.`);
fs.writeFileSync(path.join(process.cwd(), "scripts", "lesson-manifest.generated.json"), JSON.stringify(output, null, 2));
console.log("Wrote scripts/lesson-manifest.generated.json");
