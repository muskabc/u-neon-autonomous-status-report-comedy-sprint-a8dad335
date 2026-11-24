import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

const folder = dirname(fileURLToPath(import.meta.url));
const bytes = fs.readFileSync(join(folder, "line.txt"));
let line: string;
try {
  line = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
} catch {
  throw new Error("line.txt is not valid UTF-8");
}
// Drop every trailing line break, not just one: an editor that leaves
// extra blank lines at the end of the file must not change the entry.
line = line.replace(/(\r\n|\n|\r)+$/, "");
// A status line is plain display text: no control characters may survive
// (newlines were already stripped above, so any left is a real problem).
if (/[\u0000-\u001f\u007f]/.test(line)) {
  throw new Error("entry must not contain control characters");
}

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
