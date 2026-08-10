import { describe, expect, it } from 'vitest';

import { DSL_VERSION, validatePageDsl } from './index.js';

const validPage = {
  dsl: '1.0',
  requires: { runtime: '>=1.0.0' },
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
      params: { keyword: '${state.keyword}' },
    },
  },
  lifecycle: {
    onInit: [],
    onLoad: [{ action: 'reload' }],
  },
  body: {
    type: 'Page',
    children: [
      {
        type: 'Card',
        props: { title: '客户详情' },
        children: [
          {
            type: 'Button',
            props: { text: '保存' },
            events: {
              onClick: [
                { action: 'validate' },
                { action: 'submit', params: { id: '${row.id}' } },
              ],
            },
            permission: ['customer:edit'],
            when: "${state.status == 'ACTIVE'}",
          },
        ],
      },
    ],
  },
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('DSL_VERSION', () => {
  it('is the current spec version', () => {
    expect(DSL_VERSION).toBe('1.0');
  });
});

describe('validatePageDsl', () => {
  it('accepts a complete valid Page DSL document', () => {
    const result = validatePageDsl(validPage);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects a document missing the dsl version field', () => {
    const { dsl: _dsl, ...doc } = validPage;
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/dsl', keyword: 'required' }),
    );
  });

  it('rejects a document missing page.id', () => {
    const doc = clone(validPage) as Record<string, any>;
    delete doc.page.id;
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/page/id', keyword: 'required' }),
    );
  });

  it('rejects a nested node missing type and locates its path', () => {
    const doc = clone(validPage) as Record<string, any>;
    delete doc.body.children[0].children[0].type;
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/children/0/children/0/type',
        keyword: 'required',
      }),
    );
  });

  it('aggregates multiple errors in one result', () => {
    const result = validatePageDsl({ page: {} });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
    const paths = result.errors.map((e) => e.path);
    expect(paths).toContain('/dsl');
    expect(paths).toContain('/page/id');
    for (const error of result.errors) {
      expect(error).toHaveProperty('path');
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('keyword');
    }
  });

  it('rejects a non-string requires.runtime', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.requires = { runtime: 123 };
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/requires/runtime', keyword: 'type' }),
    );
  });

  it('rejects unknown dataSource types', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.dataSources.customers.type = 'websocket';
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.keyword).toBe('enum');
  });

  it('accepts object-form permission on page, node and action', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.page.permission = { code: ['customer:view'], denied: 'hidden' };
    doc.body.children[0].children[0].permission = {
      code: 'customer:edit',
      denied: 'disabled',
    };
    doc.lifecycle.onLoad = [
      { action: 'reload', permission: { code: 'customer:view' } },
    ];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects object-form permission with invalid denied strategy', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.body.children[0].children[0].permission = {
      code: 'customer:edit',
      denied: 'toast',
    };
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
  });

  it('accepts ActionConfig.id（命名动作结果，设计文档第 48 节）', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.body.children[0].children[0].events.onClick = [
      { id: 'editResult', action: 'overlay.open' },
      {
        action: 'if',
        params: { condition: '${actions.editResult.success}' },
      },
    ];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects empty-string ActionConfig.id', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.body.children[0].children[0].events.onClick = [{ id: '', action: 'reload' }];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
  });
});
