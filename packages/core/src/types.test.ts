import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  ActionConfig,
  DslNode,
  PageDsl,
  PermissionConfig,
  RuntimeScope,
} from './index.js';
import { RUNTIME_SCOPES } from './index.js';

describe('DslNode', () => {
  it('accepts a nested tree with events, when and permission', () => {
    const node: DslNode = {
      id: 'save-btn',
      type: 'Button',
      props: { text: '保存' },
      events: {
        onClick: {
          action: 'submit',
          params: { id: '${row.id}' },
        },
      },
      permission: 'customer:edit',
      when: "${state.status == 'ACTIVE'}",
      children: [
        {
          type: 'Icon',
          props: { name: 'save' },
        },
      ],
    };

    expect(node.type).toBe('Button');
    expect(node.children?.[0]?.type).toBe('Icon');
    expectTypeOf(node.events?.onClick).toEqualTypeOf<
      ActionConfig | ActionConfig[] | undefined
    >();
  });

  it('supports a single action or an action array on one event', () => {
    const single: DslNode = {
      type: 'Button',
      events: { onClick: { action: 'reload' } },
    };
    const multiple: DslNode = {
      type: 'Button',
      events: {
        onClick: [{ action: 'validate' }, { action: 'submit' }],
      },
    };

    expect(single.events?.onClick).toEqual({ action: 'reload' });
    expect(Array.isArray(multiple.events?.onClick)).toBe(true);
  });
});

describe('ActionConfig.id（命名动作结果）', () => {
  it('接受可选 id，缺省为 undefined', () => {
    const named: ActionConfig = {
      id: 'editResult',
      action: 'overlay.open',
      params: { overlay: { type: 'modal' } },
    };
    const anonymous: ActionConfig = { action: 'reload' };

    expect(named.id).toBe('editResult');
    expect(anonymous.id).toBeUndefined();
    expectTypeOf(named.id).toEqualTypeOf<string | undefined>();
  });

  it('DslNode 事件的 ActionConfig 同样接受 id', () => {
    const node: DslNode = {
      type: 'Button',
      events: {
        onClick: [
          { id: 'editResult', action: 'overlay.open' },
          {
            action: 'if',
            params: { condition: '${actions.editResult.success}' },
          },
        ],
      },
    };

    const [first] = node.events?.onClick as ActionConfig[];
    expect(first.id).toBe('editResult');
  });
});

describe('PermissionConfig', () => {
  it('accepts string, string array and object forms', () => {
    const single: PermissionConfig = 'customer:edit';
    const multiple: PermissionConfig = ['customer:edit', 'customer:view'];
    const object: PermissionConfig = {
      code: ['customer:edit'],
      denied: 'disabled',
    };
    const objectWithoutDenied: PermissionConfig = { code: 'customer:edit' };

    expect(objectWithoutDenied.denied).toBeUndefined();
    expectTypeOf(single).toMatchTypeOf<PermissionConfig>();
    expectTypeOf(multiple).toMatchTypeOf<PermissionConfig>();
    expectTypeOf(object).toMatchTypeOf<PermissionConfig>();
  });

  it('rejects invalid denied strategies at compile time', () => {
    // @ts-expect-error denied 仅允许 hidden / disabled / readonly
    const invalid: PermissionConfig = { code: 'a', denied: 'toast' };

    expect(invalid).toBeDefined();
  });

  it('DslNode 与 ActionConfig 均接受对象形式 permission', () => {
    const node: DslNode = {
      type: 'Button',
      permission: { code: 'customer:edit', denied: 'readonly' },
    };
    const action: ActionConfig = {
      action: 'submit',
      permission: { code: ['customer:edit'] },
    };

    expect(node.permission).toEqual({ code: 'customer:edit', denied: 'readonly' });
    expect(action.permission).toEqual({ code: ['customer:edit'] });
  });
});

describe('PageDsl', () => {
  it('accepts the standard root structure from the design doc (section 10)', () => {
    const page: PageDsl = {
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
        onLoad: [],
      },
      body: {
        type: 'Page',
        children: [],
      },
    };

    expect(page.page.id).toBe('customer-list');
    expect(page.dataSources?.customers?.type).toBe('service');
  });
});

describe('RUNTIME_SCOPES', () => {
  it('enumerates the 8 scope levels in the documented order', () => {
    expect(RUNTIME_SCOPES).toEqual([
      'global',
      'app',
      'page',
      'overlay',
      'form',
      'component',
      'row',
      'event',
    ]);
    expectTypeOf(RUNTIME_SCOPES[0]).toMatchTypeOf<RuntimeScope>();
  });
});
