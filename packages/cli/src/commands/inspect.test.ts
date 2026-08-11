import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import {
  createTempDir,
  createTestIo,
  VALID_PAGE_YAML,
  writeText,
} from '../test-utils.js';
import { runInspect } from './inspect.js';

describe('pactor inspect', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('输出结构摘要：page id、组件计数、数据源、动作、权限与表达式', () => {
    const file = join(temp.dir, 'demo.page.yaml');
    writeText(file, VALID_PAGE_YAML);
    const { io, out } = createTestIo();

    const code = runInspect(parseArgs([file]), io);
    expect(code).toBe(0);
    const text = out.join('\n');
    expect(text).toContain('page: demo');
    expect(text).toContain('标题: 演示页');
    expect(text).toContain('类型: list');
    expect(text).toContain('状态键: keyword');
    expect(text).toContain('customers (type=service, service=customer.list)');
    expect(text).toContain('Page x1');
    expect(text).toContain('Button x1');
    expect(text).toContain('events.onClick → navigate');
    expect(text).toContain('demo:view');
    expect(text).toContain('${state.keyword}');
  });

  it('参数不是恰好一个文件时退出码 2', () => {
    const { io } = createTestIo();
    expect(runInspect(parseArgs([]), io)).toBe(2);
    expect(runInspect(parseArgs(['a.yaml', 'b.yaml']), io)).toBe(2);
  });

  it('文件不存在退出码 2', () => {
    const { io } = createTestIo();
    expect(runInspect(parseArgs([join(temp.dir, 'missing.page.yaml')]), io)).toBe(2);
  });
});
