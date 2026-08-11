import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import {
  createTempDir,
  createTestIo,
  INVALID_PAGE_YAML,
  VALID_PAGE_YAML,
  writeText,
} from '../test-utils.js';
import { runBuild } from './build.js';

describe('pactor build', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('编译输出 envelope：<out>/<pageId>.json 含 resourceType 与 schema', () => {
    const src = join(temp.dir, 'src');
    mkdirSync(src);
    writeText(join(src, 'demo.page.yaml'), VALID_PAGE_YAML);
    const outDir = join(temp.dir, 'out');
    const { io } = createTestIo();

    const code = runBuild(parseArgs([src, '-o', outDir]), io);
    expect(code).toBe(0);

    const target = join(outDir, 'demo.json');
    expect(existsSync(target)).toBe(true);
    const envelope = JSON.parse(readFileSync(target, 'utf8')) as Record<string, unknown>;
    expect(envelope.id).toBe('demo');
    expect(envelope.resourceType).toBe('page');
    expect(envelope.version).toBe(1);
    expect(envelope.dslVersion).toBe('1.0');
    expect(envelope.schema).toBeDefined();
    expect((envelope.schema as { page: { id: string } }).page.id).toBe('demo');
  });

  it('fragment 编译为 resourceType fragment，id 取 fragment.id', () => {
    const src = join(temp.dir, 'src');
    mkdirSync(src);
    writeText(
      join(src, 'card.fragment.yaml'),
      `dsl: '1.0'\nfragment:\n  id: card\nbody:\n  type: Card\n`,
    );
    const outDir = join(temp.dir, 'out');
    const { io } = createTestIo();

    const code = runBuild(parseArgs([src, '-o', outDir]), io);
    expect(code).toBe(0);
    const envelope = JSON.parse(
      readFileSync(join(outDir, 'card.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(envelope.resourceType).toBe('fragment');
  });

  it('校验失败报告并以退出码 1 中止，不写产物', () => {
    const src = join(temp.dir, 'src');
    mkdirSync(src);
    writeText(join(src, 'ok.page.yaml'), VALID_PAGE_YAML);
    writeText(join(src, 'bad.page.yaml'), INVALID_PAGE_YAML);
    const outDir = join(temp.dir, 'out');
    const { io, err } = createTestIo();

    const code = runBuild(parseArgs([src, '-o', outDir]), io);
    expect(code).toBe(1);
    const text = err.join('\n');
    expect(text).toContain('bad.page.yaml');
    expect(text).toContain('/page/id');
    expect(existsSync(outDir)).toBe(false);
  });

  it('缺 -o 退出码 2', () => {
    const { io } = createTestIo();
    expect(runBuild(parseArgs([temp.dir]), io)).toBe(2);
  });

  it('源目录不存在退出码 2', () => {
    const { io } = createTestIo();
    expect(
      runBuild(parseArgs([join(temp.dir, 'missing'), '-o', join(temp.dir, 'out')]), io),
    ).toBe(2);
  });
});
