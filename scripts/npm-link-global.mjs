#!/usr/bin/env node
/**
 * 将 packages/* 注册到 npm 全局 link 表（等价于在各包目录执行 npm link）。
 * 消费工程仍保持 package.json 中的 semver 依赖，通过 npm link @pactor-app/* 覆盖 node_modules。
 *
 * 用法（pactor 根目录）：
 *   pnpm build && node scripts/npm-link-global.mjs
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 按依赖顺序注册；目录名 → package.json name */
const PACKAGES = [
  { dir: "expression", name: "@pactor-app/expression" },
  { dir: "core", name: "@pactor-app/core" },
  { dir: "schema", name: "@pactor-app/schema" },
  { dir: "permission", name: "@pactor-app/permission" },
  { dir: "resource", name: "@pactor-app/resource" },
  { dir: "i18n", name: "@pactor-app/i18n" },
  { dir: "router", name: "@pactor-app/router" },
  { dir: "runtime", name: "@pactor-app/runtime" },
  { dir: "ui", name: "@pactor-app/ui" },
  { dir: "app", name: "@pactor-app/app" },
  { dir: "pactor", name: "pactor-app" },
];

for (const { dir, name } of PACKAGES) {
  const cwd = join(root, "packages", dir);
  const dist = join(cwd, "dist");
  if (!existsSync(dist)) {
    console.error(`跳过 ${name}：缺少 dist，请先 pnpm build`);
    continue;
  }
  execSync("npm link", { cwd, stdio: "inherit" });
  console.log(`linked global → ${name}`);
}

console.log(`
消费工程（依赖声明勿改），在应用目录执行一次：

  npm link @pactor-app/core @pactor-app/i18n @pactor-app/runtime @pactor-app/router @pactor-app/schema @pactor-app/ui pactor-app

改 pactor 后：pnpm build，重启 next dev（必要时重新 npm link）。
`);
