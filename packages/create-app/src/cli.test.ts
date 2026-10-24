import { mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isMainEntry, runCli } from './cli.js';
import { defaultTemplatesDir, type CliIo } from './create.js';

/** 内存收集输出的 io */
function makeIo(): { io: CliIo; out: string[]; err: string[] } {
  const out: string[] = [];
  const err: string[] = [];
  return {
    io: { out: (l) => out.push(l), err: (l) => err.push(l) },
    out,
    err,
  };
}

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), 'create-pactor-app-'));
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

/** 读取生成工程的 package.json */
function readPkg(dir: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

/** 断言依赖中无 link: 前缀 */
function expectNoLinkDeps(pkg: Record<string, unknown>): void {
  for (const field of ['dependencies', 'devDependencies']) {
    const deps = (pkg[field] ?? {}) as Record<string, string>;
    for (const [dep, range] of Object.entries(deps)) {
      expect(range, `${field}.${dep}`).not.toMatch(/^link:/);
    }
  }
}

describe('create-pactor-app', () => {
  it('生成 spa 模板：文件齐备、name 替换、依赖无 link:、private 保留', async () => {
    const target = join(workDir, 'my-spa');
    const { io, out } = makeIo();
    const code = await runCli([target, '-t', 'spa'], io);

    expect(code).toBe(0);
    for (const file of ['package.json', 'README.md', 'index.html', 'vite.config.ts', 'src/main.tsx']) {
      expect(existsSync(join(target, file)), file).toBe(true);
    }
    const pkg = readPkg(target);
    expect(pkg.name).toBe('my-spa');
    expect(pkg.private).toBe(true);
    expect(pkg.packageManager).toBeUndefined();
    expectNoLinkDeps(pkg);
    expect(out.some((l) => l.includes('已创建工程'))).toBe(true);
    expect(out.some((l) => l.includes('9012'))).toBe(true);
  });

  it('生成 next-app 模板（显式 -t）：文件齐备、README 首行替换为应用名', async () => {
    const target = join(workDir, 'my-next');
    const { io, out } = makeIo();
    const code = await runCli([target, '-t', 'next-app'], io);

    expect(code).toBe(0);
    for (const file of ['package.json', 'README.md', 'app/layout.tsx', 'tsconfig.json']) {
      expect(existsSync(join(target, file)), file).toBe(true);
    }
    const pkg = readPkg(target);
    expect(pkg.name).toBe('my-next');
    expectNoLinkDeps(pkg);

    // README 首行标题替换边界：首行为应用名，正文保留
    const readme = readFileSync(join(target, 'README.md'), 'utf8');
    const firstLine = readme.slice(0, readme.indexOf('\n'));
    expect(firstLine).toBe('# my-next');
    expect(readme.length).toBeGreaterThan(firstLine.length + 1);
    expect(out.some((l) => l.includes('9011'))).toBe(true);
  });

  it('未指定 -t 且非交互：用注入的选择器（模拟非 TTY 默认 next-app）', async () => {
    const target = join(workDir, 'my-default');
    const { io } = makeIo();
    const code = await runCli([target], io, {
      selectTemplate: () => Promise.resolve('next-app'),
    });
    expect(code).toBe(0);
    expect(existsSync(join(target, 'app/layout.tsx'))).toBe(true);
  });

  it('name 为路径时应用名取 basename', async () => {
    const nested = join(workDir, 'a', 'b');
    mkdirSync(nested, { recursive: true });
    const target = join(nested, 'deep-app');
    const { io } = makeIo();
    const code = await runCli([target, '-t', 'spa'], io);
    expect(code).toBe(0);
    expect(readPkg(target).name).toBe('deep-app');
  });

  it('目标目录非空：拒绝覆盖，退出码 2，已有内容不动', async () => {
    const target = join(workDir, 'occupied');
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, 'keep.txt'), 'do not touch', 'utf8');

    const { io, err } = makeIo();
    const code = await runCli([target, '-t', 'spa'], io);

    expect(code).toBe(2);
    expect(err.some((l) => l.includes('非空'))).toBe(true);
    expect(readdirSync(target)).toEqual(['keep.txt']);
    expect(readFileSync(join(target, 'keep.txt'), 'utf8')).toBe('do not touch');
  });

  it('未知模板：退出码 2', async () => {
    const { io, err } = makeIo();
    const code = await runCli([join(workDir, 'x'), '-t', 'bogus'], io);
    expect(code).toBe(2);
    expect(err.some((l) => l.includes('未知模板'))).toBe(true);
  });

  it('缺少 name / --help / 未知选项', async () => {
    const noName = makeIo();
    expect(await runCli([], noName.io)).toBe(2);

    const help = makeIo();
    expect(await runCli(['--help'], help.io)).toBe(0);
    expect(help.out.some((l) => l.includes('用法'))).toBe(true);

    const badFlag = makeIo();
    expect(await runCli(['x', '--nope'], badFlag.io)).toBe(2);
  });

  it('defaultTemplatesDir 能定位到包内 templates', () => {
    expect(existsSync(join(defaultTemplatesDir('spa'), 'package.json'))).toBe(true);
    expect(existsSync(join(defaultTemplatesDir('next-app'), 'package.json'))).toBe(true);
  });
});

describe('isMainEntry', () => {
  it('通过符号链接调用时仍识别为主入口', () => {
    const dir = mkdtempSync(join(tmpdir(), 'create-pactor-app-'));
    const real = join(dir, 'cli.js');
    writeFileSync(real, '');
    const link = join(dir, 'create-pactor-app');
    symlinkSync(real, link);

    const url = pathToFileURL(realpathSync(real)).href;
    expect(isMainEntry(url, real)).toBe(true);
    expect(isMainEntry(url, link)).toBe(true);
    expect(isMainEntry(url, undefined)).toBe(false);
    expect(isMainEntry(url, join(dir, 'other.js'))).toBe(false);
  });
});
