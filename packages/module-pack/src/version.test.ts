import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigError } from './config.js';
import { bumpPackageVersion, bumpVersion } from './version.js';

describe('bumpVersion', () => {
  it('patch / minor / major 递增', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('显式版本号原样返回', () => {
    expect(bumpVersion('1.2.3', '2.0.0')).toBe('2.0.0');
    expect(bumpVersion('1.2.3', '2.0.0-beta.1')).toBe('2.0.0-beta.1');
  });

  it('非法当前版本或非法 release 抛 ConfigError', () => {
    expect(() => bumpVersion('abc', 'patch')).toThrow(ConfigError);
    expect(() => bumpVersion('1.2.3', 'nope')).toThrow(ConfigError);
  });
});

describe('bumpPackageVersion', () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'module-pack-version-'));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('改写 package.json 版本并返回前后值', () => {
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: '@demo/app', version: '0.1.0' }, null, 2) + '\n',
    );
    const result = bumpPackageVersion({ dir, release: 'patch' });
    expect(result).toEqual({ name: '@demo/app', from: '0.1.0', to: '0.1.1' });
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as {
      version: string;
    };
    expect(pkg.version).toBe('0.1.1');
  });

  it('保留 package.json 其余字段', () => {
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: 'app', version: '1.0.0', files: ['dist-module'] }, null, 2),
    );
    bumpPackageVersion({ dir, release: 'minor' });
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as Record<
      string,
      unknown
    >;
    expect(pkg.version).toBe('1.1.0');
    expect(pkg.files).toEqual(['dist-module']);
  });

  it('package.json 缺失或版本缺失抛 ConfigError', () => {
    expect(() => bumpPackageVersion({ dir, release: 'patch' })).toThrow(ConfigError);
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app' }));
    expect(() => bumpPackageVersion({ dir, release: 'patch' })).toThrow(ConfigError);
  });
});
