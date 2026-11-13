#!/usr/bin/env node
/**
 * 将 @pactor-app/theme 的预置皮肤同步到 public/themes。
 *
 * 首屏防闪烁需要在 <head> 中同步插入 <link href="/themes/<name>.css">；
 * node_modules 里的 CSS 不能直接作为 public URL，因此保留这份生成副本。
 * 皮肤源以 @pactor-app/theme 为准：
 *
 *   pnpm theme:sync   重新生成 public/themes
 *   pnpm theme:check  校验副本是否最新（可用于 CI）
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const checkOnly = process.argv.includes("--check");
const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(appRoot, "public", "themes");

function fail(message) {
  throw new Error(`[theme-css] ${message}`);
}

function main() {
  const require = createRequire(import.meta.url);
  const manifestPath = require.resolve("@pactor-app/theme/themes.json");
  const packageRoot = dirname(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest || !Array.isArray(manifest.themes)) {
    fail("themes.json must contain a themes array");
  }

  const expected = new Map();
  for (const theme of manifest.themes) {
    if (!theme || !/^[a-z0-9-]+$/.test(theme.name)) {
      fail(`invalid theme name: ${JSON.stringify(theme?.name)}`);
    }
    const source = join(packageRoot, "skins", `${theme.name}.css`);
    if (!existsSync(source)) {
      fail(`missing ${source}; run "pnpm --filter @pactor-app/theme build" first`);
    }
    expected.set(`${theme.name}.css`, readFileSync(source, "utf8"));
  }

  if (!checkOnly) mkdirSync(outputDir, { recursive: true });
  const current = existsSync(outputDir)
    ? readdirSync(outputDir).filter((file) => file.endsWith(".css"))
    : [];

  const stale = [];
  for (const [file, content] of expected) {
    const target = join(outputDir, file);
    if (checkOnly) {
      if (!existsSync(target) || readFileSync(target, "utf8") !== content) {
        stale.push(file);
      }
    } else {
      writeFileSync(target, content);
    }
  }
  for (const file of current) {
    if (expected.has(file)) continue;
    if (checkOnly) stale.push(`${file} (orphan)`);
    else rmSync(join(outputDir, file));
  }

  if (checkOnly && stale.length > 0) {
    fail(`public/themes is stale; run "pnpm theme:sync" and commit: ${stale.join(", ")}`);
  }
  console.log(`[theme-css] ${checkOnly ? "verified" : "synced"} ${expected.size} skins → public/themes`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
