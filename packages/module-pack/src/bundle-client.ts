import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { buildSync } from 'esbuild';

/**
 * client entry 打包（esbuild）：
 * - `--bundle --format=esm --platform=browser`，react / react-dom / next /
 *   pactor-app / @pactor-app/* 全部 external（peer 单例契约，防双实例）；
 * - alias 自动从目标工程 tsconfig.json 的 compilerOptions.paths 生成（如 `@/*` → `./src/*`）；
 * - 产出 client/index.js + sourcemap；入口引入的 CSS 由 esbuild 收集为 client/index.css；
 * - client entry 不存在时跳过（纯 DSL 模块合法），由调用方提示。
 */

/** 内置 externals：peer 单例，绝不打进 bundle */
export const CLIENT_EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/client',
  'next',
  'next/*',
  'pactor-app',
  'pactor-app/*',
  '@pactor-app/*',
];

export interface BundleClientOptions {
  projectDir: string;
  /** 工程相对路径（配置 clientEntry） */
  clientEntry: string;
  /** 输出目录（绝对路径，产物为 index.js / index.js.map / 可能的 index.css） */
  outDir: string;
}

export interface BundleClientResult {
  bundled: boolean;
  /** 是否产出 index.css（esbuild 收集的 side-effect CSS） */
  css: boolean;
  /** 跳过打包时的说明（纯 DSL 模块） */
  message?: string;
}

/** esbuild 打包 client entry；入口不存在时跳过打包 */
export function bundleClient(options: BundleClientOptions): BundleClientResult {
  const entry = join(options.projectDir, options.clientEntry);
  if (!existsSync(entry)) {
    return {
      bundled: false,
      css: false,
      message: `client 入口不存在: ${options.clientEntry}（按纯 DSL 模块处理，跳过 client 打包）`,
    };
  }
  mkdirSync(options.outDir, { recursive: true });
  buildSync({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    outdir: options.outDir,
    entryNames: 'index',
    sourcemap: true,
    alias: tsconfigAliases(options.projectDir),
    external: [...CLIENT_EXTERNALS],
    logLevel: 'silent',
  });
  return {
    bundled: true,
    css: existsSync(join(options.outDir, 'index.css')),
  };
}

interface TsCompilerOptions {
  baseUrl?: string;
  paths?: Record<string, string[]>;
}

/**
 * 从目标工程 tsconfig.json 的 compilerOptions.paths 生成 esbuild alias。
 * 支持 `@/*` -> `./src/*` 通配（alias 为去掉 `/*` 的包名）与精确映射；
 * 沿 `extends`（相对路径）合并，子配置覆盖父配置。
 */
export function tsconfigAliases(projectDir: string): Record<string, string> {
  const file = join(projectDir, 'tsconfig.json');
  if (!existsSync(file)) return {};
  const compilerOptions = readTsconfig(file);
  const paths = compilerOptions.paths ?? {};
  const baseUrl = compilerOptions.baseUrl ?? '.';
  const alias: Record<string, string> = {};
  for (const [key, targets] of Object.entries(paths)) {
    const target = targets[0];
    if (typeof target !== 'string') continue;
    const name = key.endsWith('/*') ? key.slice(0, -2) : key;
    const rel = target.endsWith('/*') ? target.slice(0, -2) : target;
    alias[name] = resolve(dirname(file), baseUrl, rel);
  }
  return alias;
}

function readTsconfig(file: string, seen = new Set<string>()): TsCompilerOptions {
  if (seen.has(file) || !existsSync(file)) return {};
  seen.add(file);
  let raw: { extends?: unknown; compilerOptions?: TsCompilerOptions };
  try {
    raw = parseJsonc(readFileSync(file, 'utf8')) as typeof raw;
  } catch {
    return {};
  }
  let base: TsCompilerOptions = {};
  if (typeof raw.extends === 'string' && raw.extends.startsWith('.')) {
    base = readTsconfig(resolve(dirname(file), raw.extends), seen);
  }
  const own = raw.compilerOptions ?? {};
  return {
    baseUrl: own.baseUrl ?? base.baseUrl,
    paths: { ...(base.paths ?? {}), ...(own.paths ?? {}) },
  };
}

/** 宽松 JSONC 解析：去注释（尊重字符串字面量）与尾逗号 */
export function parseJsonc(text: string): unknown {
  let out = '';
  let inString = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i]!;
    if (inString) {
      out += c;
      if (c === '\\') {
        out += text[i + 1] ?? '';
        i += 2;
        continue;
      }
      if (c === '"') inString = false;
      i += 1;
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
      i += 1;
      continue;
    }
    if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    out += c;
    i += 1;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1')) as unknown;
}
