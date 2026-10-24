import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { ConfigError } from './config.js';

/** 版本递增类型：语义化级别或显式版本号（如 2.0.0 / 2.0.0-beta.1） */
export type VersionRelease = 'major' | 'minor' | 'patch' | (string & {});

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/;

/** 计算下一版本号；release 为 major/minor/patch 时递增，否则按显式版本号原样采用 */
export function bumpVersion(current: string, release: VersionRelease): string {
  if (release === 'major' || release === 'minor' || release === 'patch') {
    const match = SEMVER_RE.exec(current);
    if (!match) {
      throw new ConfigError(`package.json 版本号非法: ${current}（期望 x.y.z）`);
    }
    const [, major, minor, patch] = match;
    if (release === 'major') return `${Number(major) + 1}.0.0`;
    if (release === 'minor') return `${major}.${Number(minor) + 1}.0`;
    return `${major}.${minor}.${Number(patch) + 1}`;
  }
  if (!SEMVER_RE.test(release)) {
    throw new ConfigError(
      `--bump 取值非法: ${release}（支持 patch | minor | major | 显式版本号 x.y.z）`,
    );
  }
  return release;
}

export interface BumpPackageVersionOptions {
  /** 工程根目录 */
  dir?: string;
  /** 递增级别或显式版本号 */
  release: VersionRelease;
}

export interface BumpPackageVersionResult {
  name: string;
  from: string;
  to: string;
}

/** 递增工程 package.json 的 version 并写回（保留其余字段，2 空格缩进 + 末尾换行） */
export function bumpPackageVersion(options: BumpPackageVersionOptions): BumpPackageVersionResult {
  const dir = resolve(options.dir ?? process.cwd());
  const pkgFile = resolve(dir, 'package.json');
  if (!existsSync(pkgFile)) {
    throw new ConfigError(`未找到 package.json: ${dir}（请在目标工程根执行）`);
  }
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8')) as Record<string, unknown>;
  const name = typeof pkg.name === 'string' ? pkg.name : '(未命名)';
  if (typeof pkg.version !== 'string' || pkg.version === '') {
    throw new ConfigError(`package.json 缺少 version 字段: ${pkgFile}`);
  }
  const from = pkg.version;
  const to = bumpVersion(from, options.release);
  pkg.version = to;
  writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return { name, from, to };
}
