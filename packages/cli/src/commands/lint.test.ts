import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import {
  createTempDir,
  createTestIo,
  VALID_PAGE_YAML,
  writeText,
} from '../test-utils.js';
import { runLint } from './lint.js';

describe('pactor lint', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('合法 DSL 无 finding，退出码 0', () => {
    const file = join(temp.dir, 'demo.page.yaml');
    writeText(file, VALID_PAGE_YAML);
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([file]), io);
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('0 个 error，0 个 warning');
  });

  it('表达式语法错误（${state.x = }）报 expression-syntax error，退出码 1', () => {
    const file = join(temp.dir, 'bad.page.yaml');
    writeText(
      file,
      `dsl: '1.0'\npage:\n  id: demo\nbody:\n  type: Page\n  props:\n    title: \${state.x = }\n`,
    );
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([file]), io);
    expect(code).toBe(1);
    const text = out.join('\n');
    expect(text).toContain('expression-syntax');
    expect(text).toContain('[error]');
    expect(text).toContain('/body/props/title');
  });

  it('非 PascalCase 组件 type 报 component-naming warning，退出码 0', () => {
    const file = join(temp.dir, 'warn.page.yaml');
    writeText(
      file,
      `dsl: '1.0'\npage:\n  id: demo\nbody:\n  type: Page\n  children:\n    - type: myButton\n`,
    );
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([file]), io);
    expect(code).toBe(0);
    const text = out.join('\n');
    expect(text).toContain('[warning] component-naming');
    expect(text).toContain('myButton');
  });

  it('权限码非 resource:action 形态报 permission-format warning', () => {
    const file = join(temp.dir, 'perm.page.yaml');
    writeText(
      file,
      `dsl: '1.0'\npage:\n  id: demo\n  permission: just-resource\n`,
    );
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([file]), io);
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('[warning] permission-format');
  });

  it('Schema 校验失败计为 error，退出码 1', () => {
    const file = join(temp.dir, 'noid.page.yaml');
    writeText(file, `dsl: '1.0'\npage:\n  title: 无 id\n`);
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([file]), io);
    expect(code).toBe(1);
    expect(out.join('\n')).toContain('[error] schema');
  });

  it('目录递归收集 .page/.fragment.yaml，输出按文件分组', () => {
    const nested = join(temp.dir, 'pages', 'inner');
    mkdirSync(nested, { recursive: true });
    writeText(
      join(nested, 'a.page.yaml'),
      `dsl: '1.0'\npage:\n  id: a\nbody:\n  type: myButton\n`,
    );
    writeText(
      join(nested, 'b.fragment.yaml'),
      `dsl: '1.0'\nfragment:\n  id: b\nbody:\n  type: Card\n`,
    );
    const { io, out } = createTestIo();

    const code = runLint(parseArgs([join(temp.dir, 'pages')]), io);
    expect(code).toBe(0);
    const text = out.join('\n');
    expect(text).toContain('a.page.yaml:');
    expect(text).toContain('2 个文件');
  });

  it('路径不存在退出码 2', () => {
    const { io } = createTestIo();
    expect(runLint(parseArgs([join(temp.dir, 'missing')]), io)).toBe(2);
  });

  it('无参数退出码 2', () => {
    const { io } = createTestIo();
    expect(runLint(parseArgs([]), io)).toBe(2);
  });
});
