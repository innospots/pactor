import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

import { buildSync } from 'esbuild';

import { tsconfigAliases } from './bundle-client.js';

/**
 * server entry 打包（esbuild）：
 * - `--bundle --format=esm --platform=node --target=node20`；
 * - 产物固定为 server/index.mjs：模块包通常没有 `"type": "module"`，
 *   若输出 .js 会被 Node 按 CJS 解析；esbuild 的 format=esm 不会自动改扩展名，
 *   因此必须显式 outExtension；
 * - react / next / pactor 保持 external（server 端不需要，也不该打入模块）；
 *   Node built-in 由 platform=node 自动 external；
 * - alias 复用 tsconfig 的 paths（如 `@/*` → `./src/*`）；
 * - 入口必须位于工程根内，防止越界读取。
 */

/** 内置 externals：宿主/框架依赖，绝不打进 server bundle */
export const SERVER_EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/*',
  'next',
  'next/*',
  'pactor-app',
  'pactor-app/*',
  '@pactor-app/*',
];

/** server 产物文件名（与 manifest.serverEntry 一致） */
export const SERVER_BUNDLE_FILE = 'index.mjs' as const;

/** server 打包错误（入口缺失 / 越界 / 产物缺失） */
export class ServerBundleError extends Error {}

export interface BundleServerOptions {
  projectDir: string;
  /** 工程相对路径（配置 serverEntry） */
  serverEntry: string;
  /** 输出目录（绝对路径，产物为 index.mjs / index.mjs.map） */
  outDir: string;
}

export interface BundleServerResult {
  bundled: true;
  entry: typeof SERVER_BUNDLE_FILE;
}

/** esbuild 打包 server entry；入口不存在或越界时抛 ServerBundleError */
export function bundleServer(options: BundleServerOptions): BundleServerResult {
  const projectRoot = resolve(options.projectDir);
  const entry = resolve(projectRoot, options.serverEntry);
  if (!entry.startsWith(`${projectRoot}${sep}`)) {
    throw new ServerBundleError(
      `server 入口必须位于工程根内: ${options.serverEntry}`,
    );
  }
  if (!existsSync(entry)) {
    throw new ServerBundleError(`server 入口不存在: ${options.serverEntry}`);
  }

  mkdirSync(options.outDir, { recursive: true });
  buildSync({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outdir: options.outDir,
    entryNames: 'index',
    outExtension: { '.js': '.mjs' },
    sourcemap: true,
    alias: tsconfigAliases(projectRoot),
    external: [...SERVER_EXTERNALS],
    logLevel: 'silent',
  });

  if (!existsSync(join(options.outDir, SERVER_BUNDLE_FILE))) {
    throw new ServerBundleError(
      `server 打包未产出 ${SERVER_BUNDLE_FILE}（请检查 serverEntry 与 esbuild 配置）`,
    );
  }
  return { bundled: true, entry: SERVER_BUNDLE_FILE };
}
