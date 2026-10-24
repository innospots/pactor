import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { IncludeError, loadYamlExpanded } from './expand-include.js';
import { createTempDir, writeText } from './test-utils.js';

describe('$include 展开', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('递归展开 $include 并合并嵌套结构', () => {
    writeText(join(temp.dir, 'card.fragment.yaml'), `type: Card\nprops:\n  title: 卡片\n`);
    writeText(
      join(temp.dir, 'main.yaml'),
      `body:\n  children:\n    - $include: card.fragment.yaml\n    - type: Text\n`,
    );
    const value = loadYamlExpanded(temp.dir, 'main.yaml') as {
      body: { children: unknown[] };
    };
    expect(value.body.children).toEqual([
      { type: 'Card', props: { title: '卡片' } },
      { type: 'Text' },
    ]);
  });

  it('支持嵌套 $include（片段引用片段）', () => {
    writeText(join(temp.dir, 'inner.fragment.yaml'), `type: Inner\n`);
    writeText(join(temp.dir, 'outer.fragment.yaml'), `type: Outer\nchild:\n  $include: inner.fragment.yaml\n`);
    writeText(join(temp.dir, 'main.yaml'), `$include: outer.fragment.yaml\n`);
    const value = loadYamlExpanded(temp.dir, 'main.yaml') as Record<string, unknown>;
    expect(value).toEqual({ type: 'Outer', child: { type: 'Inner' } });
  });

  it('循环引用报错并带引用链', () => {
    writeText(join(temp.dir, 'a.yaml'), `next:\n  $include: b.yaml\n`);
    writeText(join(temp.dir, 'b.yaml'), `next:\n  $include: a.yaml\n`);
    expect(() => loadYamlExpanded(temp.dir, 'a.yaml')).toThrowError(IncludeError);
    try {
      loadYamlExpanded(temp.dir, 'a.yaml');
      expect.unreachable();
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('循环引用');
      expect(message).toContain('a.yaml -> b.yaml -> a.yaml');
    }
  });

  it('$include 与其他字段并列时报错', () => {
    writeText(join(temp.dir, 'part.yaml'), `type: Part\n`);
    writeText(join(temp.dir, 'main.yaml'), `body:\n  $include: part.yaml\n  extra: 1\n`);
    expect(() => loadYamlExpanded(temp.dir, 'main.yaml')).toThrowError(
      /\$include 不能与其他字段并列/,
    );
  });

  it('$include 值不是字符串时报错', () => {
    writeText(join(temp.dir, 'main.yaml'), `body:\n  $include: 3\n`);
    expect(() => loadYamlExpanded(temp.dir, 'main.yaml')).toThrowError(
      /\$include 必须是字符串/,
    );
  });

  it('YAML 语法错误带文件路径', () => {
    writeText(join(temp.dir, 'bad.yaml'), `a: [1, 2\n  b: }\n`);
    expect(() => loadYamlExpanded(temp.dir, 'bad.yaml')).toThrowError(/bad\.yaml/);
  });
});
