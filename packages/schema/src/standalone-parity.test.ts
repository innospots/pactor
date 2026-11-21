import { describe, expect, it } from 'vitest';

import { validatePageDsl } from './validate.js';
// 构建期产物（test 前先执行 build，见 package.json；类型来自 dist/standalone.d.ts）
import { validatePageDslStandalone } from '../dist/standalone.js';

const CASES: { name: string; document: unknown }[] = [
  {
    name: '合法页面',
    document: {
      dsl: '1.0',
      page: { id: 'demo', title: 'Demo' },
      body: { type: 'Page', children: [] },
    },
  },
  {
    name: '缺少 page.id',
    document: { dsl: '1.0', page: { title: 'Demo' }, body: { type: 'Page' } },
  },
  {
    name: '缺少 dsl 版本',
    document: { page: { id: 'demo' }, body: { type: 'Page' } },
  },
  {
    name: 'body 为非法节点',
    document: { dsl: '1.0', page: { id: 'demo' }, body: { props: {} } },
  },
  { name: '完全不是对象', document: 'not a dsl' },
  { name: '空对象', document: {} },
];

describe('standalone 预编译校验器与默认 Ajv 路径一致性', () => {
  for (const { name, document } of CASES) {
    it(name, () => {
      const expected = validatePageDsl(document);
      const actual = validatePageDslStandalone(document);
      expect(actual.valid).toBe(expected.valid);
      expect(actual.errors).toEqual(expected.errors);
      expect(actual.warnings).toEqual(expected.warnings);
    });
  }

  it('非法 DSL 的 standalone 错误是结构化的（非降级跳过）', () => {
    const result = validatePageDslStandalone({ page: { title: 'x' } });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.keyword === 'required')).toBe(true);
  });
});
