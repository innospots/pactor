#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseDocument } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const GENERATED = join(ROOT, ".generated/pactor");
const require = createRequire(import.meta.url);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function matchesPrefix(value, prefix) {
  const path = value.split(/[?#]/, 1)[0];
  return path === prefix || path.startsWith(`${prefix}/`);
}

function collectStrings(value, visit) {
  if (typeof value === "string") {
    visit(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, visit);
  }
}

function listYamlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listYamlFiles(full));
    } else if (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml")) {
      files.push(full);
    }
  }
  return files;
}

/**
 * 模块 API 校验：
 * - 同一模块前缀不得重复 / 互相包含；
 * - 跨模块同名前缀只提示（公开 URL 已由 /api/modules/<moduleId>/ 隔离）；
 * - 声明 serverEntry 的包必须能解析 <pkg>/server；
 * - 模块 DSL 中不得残留未 namespacing 的原始 /api/<prefix> URL。
 */
function validateModuleServers() {
  const serversPath = join(GENERATED, "servers.json");
  if (!existsSync(serversPath)) {
    throw new Error(`缺少 ${serversPath}，请先执行 assemble:modules`);
  }

  const modules = readJson(serversPath).modules ?? [];
  const owners = new Map();

  for (const mod of modules) {
    const { moduleId, package: packageName } = mod;
    const prefixes = mod.prefixes ?? [];
    if (prefixes.length === 0) {
      throw new Error(`${moduleId} 的 apiPrefixes 不能为空`);
    }

    const seen = new Set();
    for (const prefix of prefixes) {
      if (seen.has(prefix)) {
        throw new Error(`${moduleId} 的 apiPrefixes 重复：${prefix}`);
      }
      seen.add(prefix);
      for (const other of prefixes) {
        if (prefix !== other && other.startsWith(`${prefix}/`)) {
          throw new Error(
            `${moduleId} 的 apiPrefixes 互相包含：${prefix} 与 ${other}`,
          );
        }
      }

      const owner = owners.get(prefix);
      if (owner && owner !== moduleId) {
        console.warn(
          `[validate] 提示：模块 ${owner} 与 ${moduleId} 使用相同 API 前缀 ${prefix}（公开 URL 已隔离）`,
        );
      } else {
        owners.set(prefix, moduleId);
      }
    }

    try {
      require.resolve(`${packageName}/server`, { paths: [ROOT] });
    } catch {
      throw new Error(
        `${moduleId} 声明了 serverEntry，但无法解析 "${packageName}/server"`,
      );
    }

    const dslDir = join(GENERATED, "dsl", moduleId);
    if (!existsSync(dslDir)) continue;
    for (const file of listYamlFiles(dslDir)) {
      const doc = parseDocument(readFileSync(file, "utf8"));
      if (doc.errors.length > 0) {
        throw new Error(
          `${file} YAML 解析失败：${doc.errors.map((e) => e.message).join("; ")}`,
        );
      }
      collectStrings(doc.toJS(), (value) => {
        for (const prefix of prefixes) {
          if (matchesPrefix(value, prefix)) {
            throw new Error(
              `${file} 残留未改写为 /api/modules/${moduleId}/... 的 API URL：${value}`,
            );
          }
        }
      });
    }
  }

  return modules.length;
}

function main() {
  const assemblyPath = join(GENERATED, "assembly.json");
  const assembly = readJson(assemblyPath);
  const routes = assembly.routes ?? [];

  const seen = new Map();
  for (const route of routes) {
    const key = route.publicPath;
    if (seen.has(key)) {
      throw new Error(
        `路由 URL 冲突：${key}（${seen.get(key)} vs ${route.globalPageId}）`,
      );
    }
    seen.set(key, route.globalPageId);
  }

  const pageIds = new Set();
  const pages = readJson(join(GENERATED, "pages.json")).pages ?? [];
  for (const page of pages) {
    if (pageIds.has(page.globalPageId)) {
      throw new Error(`globalPageId 重复：${page.globalPageId}`);
    }
    pageIds.add(page.globalPageId);
  }

  // 菜单的 pageId 必须在页面索引中存在：Shell 固定菜单可能直接指向
  // 某个模块页面，模块漏装 / 页面改名时应在构建期失败，而不是运行时 404。
  const menus = readJson(join(GENERATED, "menus.json")).menus ?? [];
  const checkMenus = (items) => {
    for (const item of items) {
      if (typeof item.pageId === "string" && !pageIds.has(item.pageId)) {
        throw new Error(
          `菜单 ${item.id ?? "(anonymous)"} 引用了不存在的页面：${item.pageId}`,
        );
      }
      if (Array.isArray(item.children)) checkMenus(item.children);
    }
  };
  checkMenus(menus);

  const serverCount = validateModuleServers();

  console.log(
    `[validate] 通过：${routes.length} 条路由，${pages.length} 个页面，${menus.length} 个顶层菜单，${serverCount} 个模块 API`,
  );
}

main();
