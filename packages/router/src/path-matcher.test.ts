import { describe, expect, it } from 'vitest';

import { MenuRegistry, type MenuItem } from './menu.js';
import { match, parseQuery, resolveRoute } from './path-matcher.js';

describe('match', () => {
  it('参数提取', () => {
    expect(match('/customers/:id/edit', '/customers/123/edit')).toEqual({
      params: { id: '123' },
    });
  });

  it('段数不同不匹配', () => {
    expect(match('/customers/:id', '/customers/123/edit')).toBeNull();
    expect(match('/customers/:id/edit', '/customers/123')).toBeNull();
  });

  it('静态段不一致不匹配', () => {
    expect(match('/customers/:id/edit', '/customers/123/view')).toBeNull();
  });

  it('纯静态路径精确匹配', () => {
    expect(match('/customers', '/customers')).toEqual({ params: {} });
    expect(match('/customers', '/orders')).toBeNull();
  });
});

describe('parseQuery', () => {
  it('解析查询串', () => {
    expect(parseQuery('?tab=risk&page=2')).toEqual({ tab: 'risk', page: '2' });
  });

  it('空字符串与裸 ? 返回空对象', () => {
    expect(parseQuery('')).toEqual({});
    expect(parseQuery('?')).toEqual({});
  });
});

const menus: MenuItem[] = [
  {
    id: 'customer-list',
    type: 'page',
    title: '客户列表',
    path: '/customers',
    pageId: 'customer-list',
  },
  {
    id: 'customer-edit',
    type: 'page',
    title: '编辑客户',
    path: '/customers/:id/edit',
    pageId: 'customer-edit',
    hidden: true,
    activeMenu: 'customer-list',
  },
];

describe('resolveRoute', () => {
  const registry = new MenuRegistry(menus);

  it('详情页 activeMenu 指向列表页', () => {
    const route = resolveRoute(registry, {
      pathname: '/customers/123/edit',
    });

    expect(route).not.toBeNull();
    expect(route?.activeMenu).toBe('customer-list');
    expect(route?.pageId).toBe('customer-edit');
    expect(route?.menuId).toBe('customer-edit');
    expect(route?.params).toEqual({ id: '123' });
    expect(route?.path).toBe('/customers/123/edit');
  });

  it('activeMenu 缺省取自身 id', () => {
    const route = resolveRoute(registry, { pathname: '/customers' });

    expect(route?.activeMenu).toBe('customer-list');
  });

  it('query 进入 route context', () => {
    const route = resolveRoute(registry, {
      pathname: '/customers',
      search: '?tab=risk',
    });

    expect(route?.query.tab).toBe('risk');
  });

  it('未命中返回 null', () => {
    expect(resolveRoute(registry, { pathname: '/nope' })).toBeNull();
  });
});
