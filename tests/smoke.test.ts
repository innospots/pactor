/**
 * 跨包冒烟测试（tasks 5.4）：
 * 用设计文档第 10 节的 Page DSL 示例，走一遍 schema 校验 + 表达式求值。
 */
import { resolveTemplate } from '@pactor-app/expression';
import { DSL_VERSION, validatePageDsl } from '@pactor-app/schema';
import { describe, expect, it } from 'vitest';

// 设计文档第 10 节的标准 Page DSL 示例（JSON 运行时格式）
const pageDsl = {
  dsl: '1.0',
  requires: {
    runtime: '>=1.0.0',
  },
  page: {
    id: 'customer-list',
    title: '客户管理',
    type: 'list',
    permission: 'customer:view',
  },
  state: {
    keyword: '',
    selectedRows: [],
  },
  dataSources: {
    customers: {
      type: 'service',
      service: 'customer.list',
      autoLoad: true,
      params: {
        keyword: '${state.keyword}',
      },
    },
  },
  lifecycle: {
    onInit: [],
    onLoad: [],
  },
  body: {
    type: 'Page',
    children: [],
  },
};

describe('cross-package smoke: schema + expression', () => {
  it('the doc example passes schema validation and matches DSL_VERSION', () => {
    const result = validatePageDsl(pageDsl);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(pageDsl.dsl).toBe(DSL_VERSION);
  });

  it('resolves the expression in dataSource params against page state', () => {
    const template = pageDsl.dataSources.customers.params.keyword;
    const scope = { state: pageDsl.state };

    expect(resolveTemplate(template, scope)).toBe('');
    expect(
      resolveTemplate(template, { state: { ...pageDsl.state, keyword: '张三' } }),
    ).toBe('张三');
  });
});
