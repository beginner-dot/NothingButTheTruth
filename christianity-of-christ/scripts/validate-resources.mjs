import fs from "node:fs";

const file = "resources.json";
const raw = fs.readFileSync(file, "utf8");
const resources = JSON.parse(raw);

const placeholders = resources.filter((resource) => String(resource.url).includes("PLACEHOLDER"));
if (placeholders.length) {
  console.log("Placeholder URLs still present:");
  placeholders.forEach((resource) => console.log(`- ${resource.title}: ${resource.url}`));
  process.exitCode = 1;
} else {
  console.log("All resource URLs are live.");
}
