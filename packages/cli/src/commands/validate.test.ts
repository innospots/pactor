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
import { runValidate } from './validate.js';

describe('pactor validate', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('合法 page.yaml 通过，退出码 0', () => {
    const file = join(temp.dir, 'demo.page.yaml');
    writeText(file, VALID_PAGE_YAML);
    const { io, out, err } = createTestIo();

    const code = runValidate(parseArgs([file]), io);
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('校验通过');
    expect(err).toEqual([]);
  });

  it('缺少 page.id 的文件报错，退出码 1，输出含文件名与 /page/id', () => {
    const file = join(temp.dir, 'bad.page.yaml');
    writeText(file, INVALID_PAGE_YAML);
    const { io, err } = createTestIo();

    const code = runValidate(parseArgs([file]), io);
    expect(code).toBe(1);
    const text = err.join('\n');
    expect(text).toContain(file);
    expect(text).toContain('/page/id');
  });

  it('合法 fragment 宽松检查通过', () => {
    const file = join(temp.dir, 'ok.fragment.yaml');
    writeText(file, `dsl: '1.0'\nfragment:\n  id: f1\nbody:\n  type: Card\n`);
    const { io } = createTestIo();
    expect(runValidate(parseArgs([file]), io)).toBe(0);
  });

  it('缺 dsl/body 的 fragment 校验失败，退出码 1', () => {
    const file = join(temp.dir, 'bad.fragment.yaml');
    writeText(file, `fragment:\n  id: f1\n`);
    const { io, err } = createTestIo();
    const code = runValidate(parseArgs([file]), io);
    expect(code).toBe(1);
    expect(err.join('\n')).toContain('dsl 与 body');
  });

  it('YAML 语法错误带位置信息，退出码 1', () => {
    const file = join(temp.dir, 'syntax.page.yaml');
    writeText(file, 'dsl: [unclosed\n');
    const { io, err } = createTestIo();
    const code = runValidate(parseArgs([file]), io);
    expect(code).toBe(1);
    expect(err.join('\n')).toContain('行');
  });

  it('无参数退出码 2', () => {
    const { io, err } = createTestIo();
    expect(runValidate(parseArgs([]), io)).toBe(2);
    expect(err.join('\n')).toContain('用法');
  });

  it('文件不存在退出码 2', () => {
    const { io } = createTestIo();
    expect(runValidate(parseArgs([join(temp.dir, 'missing.page.yaml')]), io)).toBe(2);
  });
});
