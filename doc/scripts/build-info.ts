/**
 * 构建信息生成：astro build 前生成 src/generated/build-info.json，
 * 供站点页脚等展示构建版本 / Git 提交号 / 构建时间。
 *
 * 直接执行：node --experimental-strip-types scripts/build-info.ts
 *
 * 取值优先级：
 *  - version：ASSET_LIB_VERSION，缺省 'dev'
 *  - commit ：CF_PAGES_COMMIT_HASH → GITHUB_SHA → 本地 git rev-parse --short HEAD
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export interface BuildInfo {
  version: string;
  commit: string;
  builtAt: string;
}

const DOC_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function resolveBuildInfo(rootDir: string = DOC_ROOT): BuildInfo {
  const version = process.env.ASSET_LIB_VERSION ?? 'dev';
  let commit = process.env.CF_PAGES_COMMIT_HASH ?? process.env.GITHUB_SHA ?? '';
  if (commit === '') {
    try {
      commit = execSync('git rev-parse --short HEAD', {
        cwd: rootDir,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
    } catch {
      commit = 'unknown';
    }
  }
  return { version, commit, builtAt: new Date().toISOString() };
}

export function generateBuildInfo(rootDir: string = DOC_ROOT): BuildInfo {
  const info = resolveBuildInfo(rootDir);
  const outPath = join(rootDir, 'src', 'generated', 'build-info.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(info, null, 2)}\n`, 'utf8');
  return info;
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  const info = generateBuildInfo();
  console.log(
    `build-info 已生成：version=${info.version} commit=${info.commit} builtAt=${info.builtAt}`,
  );
}
