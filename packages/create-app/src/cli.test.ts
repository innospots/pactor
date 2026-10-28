import { mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isMainEntry, runCli } from './cli.js';
import { defaultTemplatesDir, scaffold, type CliIo } from './create.js';

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

  it('{{KEY}} 占位符：默认取 placeholders.json 示例值，placeholders.json 不复制进工程', () => {
    const templatesDir = join(workDir, 'fixture-template');
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(
      join(templatesDir, 'placeholders.json'),
      JSON.stringify({
        APP_TITLE: { description: '标题', example: 'Example Admin' },
        APP_DESCRIPTION: { description: '描述', example: 'Neutral description.' },
      }),
      'utf8',
    );
    writeFileSync(
      join(templatesDir, 'app.json'),
      JSON.stringify({ name: '__APP_NAME__', title: '{{APP_TITLE}}', description: '{{APP_DESCRIPTION}}' }),
      'utf8',
    );

    const target = join(workDir, 'fixture-app');
    scaffold(target, 'next-app', templatesDir);

    const out = JSON.parse(readFileSync(join(target, 'app.json'), 'utf8'));
    expect(out).toEqual({ name: 'fixture-app', title: 'Example Admin', description: 'Neutral description.' });
    expect(existsSync(join(target, 'placeholders.json'))).toBe(false);
  });

  it('{{KEY}} 占位符：values 覆盖默认值', () => {
    const templatesDir = join(workDir, 'fixture-template-2');
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(
      join(templatesDir, 'placeholders.json'),
      JSON.stringify({ APP_TITLE: { example: 'Example Admin' } }),
      'utf8',
    );
    writeFileSync(join(templatesDir, 'title.txt'), '{{APP_TITLE}}', 'utf8');
    writeFileSync(join(templatesDir, 'meta.json'), '{ "title": "{{APP_TITLE}}" }', 'utf8');

    const target = join(workDir, 'fixture-app-2');
    scaffold(target, 'next-app', templatesDir, { values: { APP_TITLE: 'Model "Console"' } });

    expect(readFileSync(join(target, 'title.txt'), 'utf8')).toBe('Model "Console"');
    // 带引号字面量按 JSON 字符串值替换，结果仍是合法 JSON
    expect(JSON.parse(readFileSync(join(target, 'meta.json'), 'utf8')).title).toBe('Model "Console"');
  });

  it('--values 文件非法：退出码 2', async () => {
    const notJson = join(workDir, 'bad.json');
    writeFileSync(notJson, 'not json', 'utf8');
    const a = makeIo();
    expect(await runCli([join(workDir, 'x1'), '-t', 'spa', '--values', notJson], a.io)).toBe(2);
    expect(a.err.some((l) => l.includes('--values'))).toBe(true);

    const nonString = join(workDir, 'non-string.json');
    writeFileSync(nonString, JSON.stringify({ APP_TITLE: 42 }), 'utf8');
    const b = makeIo();
    expect(await runCli([join(workDir, 'x2'), '-t', 'spa', '--values', nonString], b.io)).toBe(2);
    expect(b.err.some((l) => l.includes('必须是字符串'))).toBe(true);
  });

  it('生成 next-app 模板（含 --values）：全工程无 {{ 与 __APP_NAME__ 残留，values 生效', async () => {
    const valuesPath = join(workDir, 'values.json');
    writeFileSync(valuesPath, JSON.stringify({ APP_TITLE: 'Model Console 验收' }), 'utf8');
    const target = join(workDir, 'my-values');
    const { io } = makeIo();
    const code = await runCli([target, '-t', 'next-app', '--values', valuesPath], io);
    expect(code).toBe(0);

    // 递归扫描文本类文件，确认无占位符残留
    const pending = [target];
    const textExt = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.css', '.yaml', '.yml', '.svg', '.html']);
    while (pending.length > 0) {
      const dir = pending.pop()!;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules') pending.push(p);
          continue;
        }
        if (!textExt.has(p.slice(p.lastIndexOf('.')))) continue;
        const text = readFileSync(p, 'utf8');
        expect(/\{\{[A-Z][A-Z0-9_]*\}\}/.test(text), p).toBe(false);
        expect(text.includes('__APP_NAME__'), p).toBe(false);
      }
    }

    // 模板含 {{APP_TITLE}} 落点时 values 必须生效（同步后的模板才有，未同步时跳过该断言）
    const layout = readFileSync(join(target, 'app/layout.tsx'), 'utf8');
    if (!layout.includes('Pactor 动态页面 Starter')) {
      expect(layout).toContain('Model Console 验收');
    }
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
