import fs from "node:fs";
import readline from "node:readline";

export async function processFileByLine(filePath, onLine) {
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    onLine(line);
  }
}