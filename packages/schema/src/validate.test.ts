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

  it('accepts free-form page meta（如 version / author / 业务自定义键）', () => {
    const result = validatePageDsl({
      ...validPage,
      meta: { version: '1.0', author: 'platform-team', tags: ['demo'] },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts page.name / page.description，拒绝非字符串', () => {
    const ok = validatePageDsl({
      ...validPage,
      page: { ...validPage.page, name: 'customerList', description: '客户列表页' },
    });
    expect(ok.valid).toBe(true);

    const bad = validatePageDsl({
      ...validPage,
      page: { ...validPage.page, name: 123 },
    });
    expect(bad.valid).toBe(false);
    expect(bad.errors).toContainEqual(
      expect.objectContaining({ path: '/page/name', keyword: 'type' }),
    );
  });

  it('rejects a non-object meta', () => {
    const result = validatePageDsl({ ...validPage, meta: 'v1' });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/meta', keyword: 'type' }),
    );
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

  it('accepts dataSource 选项字段映射（valueField / labelField / disabledField）', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.dataSources.statusOptions = {
      type: 'http',
      request: { url: '/api/status-options' },
      valueField: 'code',
      labelField: 'name',
      disabledField: 'off',
    };
    const ok = validatePageDsl(doc);
    expect(ok.valid).toBe(true);

    doc.dataSources.statusOptions = { type: 'static', value: [], valueField: 1 };
    const bad = validatePageDsl(doc);
    expect(bad.valid).toBe(false);
    expect(bad.errors).toContainEqual(
      expect.objectContaining({
        path: '/dataSources/statusOptions/valueField',
        keyword: 'type',
      }),
    );
  });

  it('accepts 页面级命名动作 actions（单个动作或动作数组）', () => {
    const ok = validatePageDsl({
      ...validPage,
      actions: {
        refresh: { action: 'reload' },
        deleteRow: [
          { action: 'confirm', params: { title: '确认删除' } },
          { action: 'request', params: { method: 'DELETE', url: '/api/items' } },
        ],
      },
    });
    expect(ok.valid).toBe(true);

    const bad = validatePageDsl({
      ...validPage,
      actions: { bad: { params: {} } },
    });
    expect(bad.valid).toBe(false);
  });

  it('accepts 引用节点（component 无 type），拒绝两者皆缺', () => {
    const ok = validatePageDsl({
      ...validPage,
      components: { header: { type: 'Page', children: [] } },
      body: {
        type: 'Page',
        children: [{ component: 'header' }],
      },
    });
    expect(ok.valid).toBe(true);

    const bad = validatePageDsl({
      ...validPage,
      body: { type: 'Page', children: [{ props: {} }] },
    });
    expect(bad.valid).toBe(false);
  });

  it('accepts 页面级命名组件 components（DslNode 子树），拒绝非法节点', () => {
    const ok = validatePageDsl({
      ...validPage,
      components: {
        searchForm: {
          type: 'Form',
          children: [{ type: 'Input', props: { name: 'keyword' } }],
        },
      },
    });
    expect(ok.valid).toBe(true);

    const bad = validatePageDsl({
      ...validPage,
      components: { broken: { props: {} } },
    });
    expect(bad.valid).toBe(false);
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

  it('accepts root-level children without body（局部描述形态）', () => {
    const doc = clone(validPage) as Record<string, any>;
    delete doc.body;
    doc.children = [
      { type: 'Alert', props: { message: '局部区块' } },
      { type: 'Button', props: { text: '操作' } },
    ];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('rejects an invalid node inside root-level children', () => {
    const doc = clone(validPage) as Record<string, any>;
    delete doc.body;
    doc.children = [{ props: { message: '缺 type' } }];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/children/0/type', keyword: 'required' }),
    );
  });

  it('warns (without failing) when body and root children coexist', () => {
    const doc = clone(validPage) as Record<string, any>;
    doc.children = [{ type: 'Alert' }];
    const result = validatePageDsl(doc);

    expect(result.valid).toBe(true);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ path: '/children', keyword: 'conflict' }),
    );
  });
});
