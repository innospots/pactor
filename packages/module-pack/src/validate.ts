import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

import { parseDocument } from 'yaml';

import { CONFIG_DEFAULTS, loadModuleConfig, type ModulePackConfig } from './config.js';
import { INCLUDE_KEY } from './expand-include.js';

/**
 * 产物校验（`pactor module validate`，构建收尾也会自动执行）：
 * - manifest 合法且字段齐备（Manifest V1）；
 * - sitemap 每个 pages[].id 在 dslRoot 下存在对应 <id>.yaml（与 Shell 装配器同语义，递归查找）；
 * - 产物中无 $include 残留；
 * - layouts 全部为对象（无字符串引用残留）；
 * - client bundle 存在且未内嵌 react / @pactor-app（启发式扫描）；
 * - package.json exports 含 ./manifest 与 ./client。
 * 输出结构化错误 / 警告列表；有错误时 ok = false。
 */

export interface ValidateModuleOptions {
  /** 目标工程根（默认 cwd） */
  dir?: string;
  /** 配置文件路径（默认 pactor.module.json） */
  config?: string;
  /** 直接指定产物目录（构建流程内部用于校验临时目录；缺省为 <dir>/<outDir>） */
  moduleDir?: string;
}

export interface ValidateModuleResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_MANIFEST_FIELDS = [
  'schemaVersion',
  'id',
  'name',
  'version',
  'pactorVersionRange',
  'basePath',
  'sitemap',
  'dslRoot',
  'assetsRoot',
] as const;

/** 校验产物目录与工程 package.json，返回结构化结果 */
export function validateModule(options: ValidateModuleOptions = {}): ValidateModuleResult {
  const projectDir = resolve(options.dir ?? process.cwd());
  const errors: string[] = [];
  const warnings: string[] = [];

  let config: ModulePackConfig | undefined;
  if (options.moduleDir === undefined) {
    try {
      config = loadModuleConfig(projectDir, options.config);
    } catch (error) {
      errors.push((error as Error).message);
      return { ok: false, errors, warnings };
    }
  } else {
    try {
      config = loadModuleConfig(projectDir, options.config);
    } catch {
      config = undefined;
    }
  }
  const moduleDir =
    options.moduleDir ?? join(projectDir, config?.outDir ?? CONFIG_DEFAULTS.outDir);

  // ── manifest ──────────────────────────────────────────────────────────
  const manifestFile = join(moduleDir, 'manifest.json');
  if (!existsSync(manifestFile)) {
    errors.push(`产物不存在: ${manifestFile}（先执行 pactor module build）`);
    return { ok: false, errors, warnings };
  }
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as Record<string, unknown>;
  } catch (error) {
    errors.push(`manifest.json 解析失败: ${(error as Error).message}`);
    return { ok: false, errors, warnings };
  }
  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (!(field in manifest)) {
      errors.push(`manifest 缺少字段: ${field}`);
    }
  }
  if (manifest.schemaVersion !== '1') {
    errors.push(`manifest.schemaVersion 必须为 "1"（当前: ${JSON.stringify(manifest.schemaVersion)}）`);
  }

  // ── sitemap / 页面 DSL ────────────────────────────────────────────────
  const dslRoot = typeof manifest.dslRoot === 'string' ? manifest.dslRoot : 'dsl';
  const sitemapRel = typeof manifest.sitemap === 'string' ? manifest.sitemap : 'dsl/sitemap.yaml';
  const sitemapFile = join(moduleDir, sitemapRel);
  if (!existsSync(sitemapFile)) {
    errors.push(`sitemap 不存在: ${sitemapRel}`);
  } else {
    const doc = parseDocument(readFileSync(sitemapFile, 'utf8'));
    if (doc.errors.length > 0) {
      errors.push(`sitemap YAML 解析失败: ${doc.errors.map((e) => e.message).join('; ')}`);
    } else {
      const site = doc.toJS() as Record<string, unknown>;
      const pages = Array.isArray(site.pages) ? (site.pages as Record<string, unknown>[]) : [];
      for (const page of pages) {
        const id = page.id;
        if (typeof id !== 'string') {
          errors.push('sitemap.pages 存在缺少 id 的页面项');
          continue;
        }
        if (findPageDslFile(join(moduleDir, dslRoot), id) === null) {
          errors.push(`页面 ${id} 缺少 DSL 文件（${dslRoot}/ 下未找到 ${id}.yaml）`);
        }
      }
      const layouts = site.layouts;
      if (layouts !== null && typeof layouts === 'object' && !Array.isArray(layouts)) {
        for (const [name, def] of Object.entries(layouts as Record<string, unknown>)) {
          if (typeof def === 'string') {
            errors.push(`布局 ${name} 仍是字符串引用（target 要求内联为对象）`);
          }
        }
      }
    }
  }

  // ── $include 残留 ─────────────────────────────────────────────────────
  const dslDir = join(moduleDir, dslRoot);
  for (const file of listFiles(dslDir)) {
    if (readFileSync(file, 'utf8').includes(INCLUDE_KEY)) {
      errors.push(`$include 残留: ${relative(moduleDir, file)}`);
    }
  }

  // ── client bundle ─────────────────────────────────────────────────────
  if (typeof manifest.clientEntry === 'string') {
    const clientFile = join(moduleDir, manifest.clientEntry);
    if (!existsSync(clientFile)) {
      errors.push(`client bundle 不存在: ${manifest.clientEntry}`);
    } else {
      const text = readFileSync(clientFile, 'utf8');
      if (/\bvar React\b|react\.production\.min|__REACT_DEVTOOLS_GLOBAL_HOOK__/.test(text)) {
        errors.push('client bundle 疑似内嵌 react（react 必须保持 external，避免双实例）');
      }
      if (/node_modules\/@pactor-app\//.test(text) || /node_modules\/pactor-app\//.test(text)) {
        errors.push('client bundle 疑似内嵌 pactor 运行时代码（@pactor-app/* 必须保持 external）');
      }
      const sizeKb = Math.round(statSync(clientFile).size / 1024);
      if (sizeKb > 512) {
        warnings.push(`client bundle 体积较大（${sizeKb}KB），请确认 react / pactor 已 external`);
      }
    }
  }

  // ── server bundle ─────────────────────────────────────────────────────
  const hasServerEntry = typeof manifest.serverEntry === 'string';
  const hasApiPrefixes = Array.isArray(manifest.apiPrefixes);
  if (hasServerEntry !== hasApiPrefixes) {
    errors.push('manifest.serverEntry 与 apiPrefixes 必须成对出现');
  }
  if (hasServerEntry) {
    const serverRel = manifest.serverEntry as string;
    const serverFile = resolve(moduleDir, serverRel);
    if (!isInsideDir(moduleDir, serverFile)) {
      errors.push(`server bundle 路径越界: ${serverRel}`);
    } else if (!existsSync(serverFile)) {
      errors.push(`server bundle 不存在: ${serverRel}`);
    } else {
      const text = readFileSync(serverFile, 'utf8');
      if (/node_modules\/(?:next|react|react-dom|@pactor-app|pactor-app)\//.test(text)) {
        warnings.push(
          'server bundle 疑似内嵌 next / react / pactor（应保持 external，由宿主提供）',
        );
      }
    }
    if (!Array.isArray(manifest.apiPrefixes) || manifest.apiPrefixes.length === 0) {
      errors.push('manifest.apiPrefixes 必须是非空数组');
    } else if (manifest.apiPrefixes.some((prefix) => typeof prefix !== 'string')) {
      errors.push('manifest.apiPrefixes 必须是字符串数组');
    }
  }

  // ── package.json exports / 版本同步 ───────────────────────────────────
  const pkgFile = join(projectDir, 'package.json');
  if (existsSync(pkgFile)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgFile, 'utf8')) as {
        version?: unknown;
        exports?: Record<string, unknown>;
      };
      const exportsMap = pkg.exports ?? {};
      if (exportsMap['./manifest'] === undefined) {
        errors.push('package.json exports 缺少 "./manifest"（Shell 装配器经 require.resolve("<pkg>/manifest") 定位）');
      }
      if (typeof manifest.clientEntry === 'string' && exportsMap['./client'] === undefined) {
        errors.push('package.json exports 缺少 "./client"（client-registry 静态 import "<pkg>/client"）');
      }
      if (typeof manifest.serverEntry === 'string' && exportsMap['./server'] === undefined) {
        errors.push('package.json exports 缺少 "./server"（Shell 装配器经 require.resolve("<pkg>/server") 定位）');
      }
      if (
        typeof pkg.version === 'string' &&
        typeof manifest.version === 'string' &&
        pkg.version !== manifest.version
      ) {
        warnings.push(
          `manifest.version (${manifest.version}) 与 package.json version (${pkg.version}) 不一致，请重新 build`,
        );
      }
    } catch {
      warnings.push('package.json 解析失败，跳过 exports 检查');
    }
  } else {
    warnings.push('未找到 package.json，跳过 exports 检查');
  }

  return { ok: errors.length === 0, errors, warnings };
}

/** 判断文件路径是否严格位于目录内（防止 manifest 路径逃逸） */
function isInsideDir(dir: string, file: string): boolean {
  const root = resolve(dir);
  return file.startsWith(`${root}${sep}`);
}

/** 与 Shell 装配器 findPageDslFile 同语义：dslRoot 下递归查找 <pageId>.yaml */function findPageDslFile(dslRootDir: string, pageId: string): string | null {
  if (!existsSync(dslRootDir)) return null;
  const queue = [dslRootDir];
  while (queue.length > 0) {
    const dir = queue.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(full);
        continue;
      }
      if (entry.name === `${pageId}.yaml`) return full;
    }
  }
  return null;
}

/** 递归列出目录下全部文件 */
function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  const walk = (target: string): void => {
    for (const entry of readdirSync(target, { withFileTypes: true })) {
      const full = join(target, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    }
  };
  walk(dir);
  return files;
}
