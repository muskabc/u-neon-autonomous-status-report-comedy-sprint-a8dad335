import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

const folder = dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(join(folder, "line.txt"), "utf8");
const line = raw.replace(/\r\n/g, "\n").replace(/\n$/, "");

if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
  throw new Error(`entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, found ${line.length}`);
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry must fit on exactly one line");
}
if (line.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, line, "utf8");

const saved = fs.readFileSync(OUT_FILE, "utf8");
if (saved !== line) {
  throw new Error("what was saved does not match line.txt");
}
console.log(`wrote ${line.length} characters to ${OUT_FILE}`);
