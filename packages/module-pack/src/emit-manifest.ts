import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { stringify } from 'yaml';

import type { ModulePackConfig } from './config.js';

/**
 * 产物落盘：dist-module/ = Manifest V1 + dsl/（sitemap + 页面 DSL）+
 * assets/（public 复制）+ module-assets.json（sha256 清单）+ client/（由 bundle 阶段写入）。
 *
 * Manifest V1 契约对齐 Shell 装配器（assemble-modules.mjs）：
 * require.resolve("<pkg>/manifest") → manifest.json；pages[].id ↔ dslRoot 下
 * <pageId>.yaml；assetsRoot 复制到 public/modules/<id>/<version>/。
 */

export interface ModuleManifest {
  schemaVersion: '1';
  id: string;
  name: string;
  /** 与目标工程 package.json version 同步 */
  version: string;
  /** 从目标工程安装的 pactor-app 版本推导（如 ^1.54.0） */
  pactorVersionRange: string;
  basePath: string;
  sitemap: 'dsl/sitemap.yaml';
  dslRoot: 'dsl';
  assetsRoot: 'assets';
  /** 纯 DSL 模块无 client bundle 时缺省 */
  clientEntry?: 'client/index.js';
  styles?: ['client/index.css'];
}

export interface EmitDslInput {
  config: ModulePackConfig;
  projectDir: string;
  /** 产物目录（绝对路径，通常是临时构建目录） */
  outDir: string;
  /** 转换 + 重写后的 sitemap */
  site: Record<string, unknown>;
  /** pageId -> 展开 + 重写后的页面 DSL */
  pages: Map<string, unknown>;
}

export interface EmitDslResult {
  assetCount: number;
}

export interface WriteManifestInput {
  config: ModulePackConfig;
  projectDir: string;
  outDir: string;
  clientEntry?: 'client/index.js';
  styles?: ['client/index.css'];
  /** 追加版本推导相关的告警 */
  warnings: string[];
}

/** 一步落盘全部产物（dsl + assets + module-assets.json + manifest.json） */
export function emitModule(
  input: EmitDslInput & Omit<WriteManifestInput, 'config' | 'projectDir' | 'outDir'>,
): EmitDslResult & { manifest: ModuleManifest } {
  const dslResult = emitDsl(input);
  const manifest = writeManifest(input);
  return { ...dslResult, manifest };
}

/** 落盘 dsl/（sitemap.yaml + <pageId>.yaml）与 assets/（含 module-assets.json） */
export function emitDsl(input: EmitDslInput): EmitDslResult {
  const { config, projectDir, outDir, site, pages } = input;
  const dslDir = join(outDir, 'dsl');
  mkdirSync(dslDir, { recursive: true });

  writeFileSync(join(dslDir, 'sitemap.yaml'), stringify(site, { lineWidth: 0 }), 'utf8');
  for (const [id, dsl] of pages) {
    writeFileSync(join(dslDir, `${id}.yaml`), stringify(dsl, { lineWidth: 0 }), 'utf8');
  }

  const publicDir = join(projectDir, config.publicDir);
  const assetsDir = join(outDir, 'assets');
  if (existsSync(publicDir)) {
    cpSync(publicDir, assetsDir, { recursive: true });
  } else {
    mkdirSync(assetsDir, { recursive: true });
  }

  const assets = hashAssets(assetsDir, assetsDir);
  writeFileSync(
    join(outDir, 'module-assets.json'),
    `${JSON.stringify({ module: config.id, assets }, null, 2)}\n`,
    'utf8',
  );
  return { assetCount: assets.length };
}

/** 生成 manifest.json（version 与目标工程 package.json 同步） */
export function writeManifest(input: WriteManifestInput): ModuleManifest {
  const { config, projectDir, outDir } = input;
  const version = readProjectVersion(projectDir);
  const manifest: ModuleManifest = {
    schemaVersion: '1',
    id: config.id,
    name: config.name,
    version,
    pactorVersionRange: resolvePactorVersionRange(projectDir, input.warnings),
    basePath: config.basePath,
    sitemap: 'dsl/sitemap.yaml',
    dslRoot: 'dsl',
    assetsRoot: 'assets',
    ...(input.clientEntry ? { clientEntry: input.clientEntry } : {}),
    ...(input.styles ? { styles: input.styles } : {}),
  };
  writeFileSync(
    join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  return manifest;
}

/** 读取目标工程 package.json 的 version（缺失时回退 0.0.0） */
export function readProjectVersion(projectDir: string): string {
  const pkgFile = join(projectDir, 'package.json');
  if (!existsSync(pkgFile)) return '0.0.0';
  try {
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8')) as { version?: unknown };
    return typeof pkg.version === 'string' && pkg.version.length > 0
      ? pkg.version
      : '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * 推导 pactorVersionRange：优先目标工程 node_modules 中实际安装的
 * pactor-app / @pactor-app/app 版本（^x.y.z）；其次 package.json 中声明的
 * 版本范围；都不可得时告警并回退 ^1.54.0。
 */
export function resolvePactorVersionRange(projectDir: string, warnings: string[]): string {
  try {
    const require = createRequire(join(projectDir, 'package.json'));
    for (const name of ['pactor-app/package.json', '@pactor-app/app/package.json']) {
      try {
        const pkgFile = require.resolve(name);
        const pkg = JSON.parse(readFileSync(pkgFile, 'utf8')) as { version?: unknown };
        if (typeof pkg.version === 'string' && pkg.version.length > 0) {
          return `^${pkg.version}`;
        }
      } catch {
        // 尝试下一个候选
      }
    }
    const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, unknown>;
      devDependencies?: Record<string, unknown>;
      peerDependencies?: Record<string, unknown>;
    };
    for (const section of ['dependencies', 'peerDependencies', 'devDependencies'] as const) {
      const range = pkg[section]?.['pactor-app'];
      if (typeof range === 'string' && range.length > 0) {
        return range;
      }
    }
  } catch {
    // 落入回退
  }
  warnings.push('未能推导目标工程的 pactor-app 版本，pactorVersionRange 回退为 ^1.54.0');
  return '^1.54.0';
}

interface AssetEntry {
  path: string;
  sha256: string;
  size: number;
}

/** 递归计算 assets 目录下全部文件的 sha256 清单（路径为 POSIX 风格相对路径） */
function hashAssets(dir: string, root: string): AssetEntry[] {
  const entries: AssetEntry[] = [];
  if (!existsSync(dir)) return entries;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...hashAssets(full, root));
      continue;
    }
    if (!entry.isFile()) continue;
    const content = readFileSync(full);
    entries.push({
      path: full.slice(root.length + 1).split('\\').join('/'),
      sha256: createHash('sha256').update(content).digest('hex'),
      size: statSync(full).size,
    });
  }
  return entries;
}
