import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { PageDsl } from "@pactor-app/core";
import { parseDocument } from "yaml";

const GENERATED_ROOT = join(process.cwd(), ".generated/pactor");

export function readGeneratedDsl(relativePath: string): PageDsl {
  const abs = join(GENERATED_ROOT, relativePath);
  const doc = parseDocument(readFileSync(abs, "utf8"));
  if (doc.errors.length > 0) {
    throw new Error(
      `${relativePath} 解析失败：${doc.errors.map((e) => e.message.split("\n")[0]).join("；")}`,
    );
  }
  return doc.toJS() as PageDsl;
}
