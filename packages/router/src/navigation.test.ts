import type { PageDsl } from '@pactor-app/core';
import { createPageRuntime, type RouterAdapter } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { MenuRegistry, type MenuItem } from './menu.js';
import {
  createRouterAdapter,
  MemoryNavigation,
} from './navigation.js';
import { resolveRoute } from './path-matcher.js';

describe('MemoryNavigation', () => {
  it('push 追加历史并通知订阅者', () => {
    const nav = new MemoryNavigation();
    const listener = vi.fn();
    nav.subscribe(listener);

    nav.push('/customers?tab=risk');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      pathname: '/customers',
      search: '?tab=risk',
    });
    expect(nav.getLocation()).toEqual({
      pathname: '/customers',
      search: '?tab=risk',
    });
  });

  it('replace 替换当前 location，退订后不再通知', () => {
    const nav = new MemoryNavigation();
    const listener = vi.fn();
    const off = nav.subscribe(listener);

    nav.replace('/x');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(nav.getLocation().pathname).toBe('/x');

    off();
    nav.push('/y');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(nav.getLocation().pathname).toBe('/y');
  });

  it('历史栈支持 back 语义', () => {
    const nav = new MemoryNavigation('/a');
    nav.push('/b');
    nav.push('/c');

    expect(nav.back()).toBe(true);
    expect(nav.getLocation().pathname).toBe('/b');
    expect(nav.back()).toBe(true);
    expect(nav.getLocation().pathname).toBe('/a');
    expect(nav.back()).toBe(false);

    // back 后 push 截断 forward 分支
    nav.push('/d');
    expect(nav.size).toBe(2);
    expect(nav.getLocation().pathname).toBe('/d');
  });
});

describe('createRouterAdapter', () => {
  it('结构化兼容 runtime RouterAdapter（编译期断言）', () => {
    const nav = new MemoryNavigation();
    // 类型不兼容时 tsc --noEmit 直接失败
    const adapter: RouterAdapter = createRouterAdapter(nav);

    adapter.navigate('/customers');

    expect(nav.getLocation().pathname).toBe('/customers');
  });
});

const pageDsl: PageDsl = {
  dsl: '1.0',
  page: { id: 'customer-list', title: '客户管理', type: 'list' },
  body: { type: 'Page', children: [] },
};

const menus: MenuItem[] = [
  {
    id: 'customer-list',
    type: 'page',
    title: '客户列表',
    path: '/customers',
    pageId: 'customer-list',
  },
  {
    id: 'customer-detail',
    type: 'page',
    title: '客户详情',
    path: '/customers/:id',
    pageId: 'customer-detail',
    hidden: true,
    activeMenu: 'customer-list',
  },
];

describe('与 @pactor-app/runtime 集成', () => {
  it('DSL navigate 动作驱动路由', async () => {
    const nav = new MemoryNavigation();
    const runtime = createPageRuntime(pageDsl, {
      router: createRouterAdapter(nav),
    });
    // navigate 动作由上层（本包 / 宿主）注册，委托 runtime route.navigate
    runtime.context.actions.register('navigate', (action, ctx) => {
      ctx.context.route.navigate(String(action.params?.['to']));
      return { ok: true };
    });

    const result = await runtime.engine.execute({
      action: 'navigate',
      params: { to: '/customers/123?tab=risk' },
    });

    expect(result.ok).toBe(true);
    expect(nav.getLocation()).toEqual({
      pathname: '/customers/123',
      search: '?tab=risk',
    });
    await runtime.destroy();
  });

  it('导航后 route 作用域可求值 ${route.params.id} 与 ${route.query.tab}', async () => {
    const registry = new MenuRegistry(menus);
    const route = resolveRoute(registry, {
      pathname: '/customers/123',
      search: '?tab=risk',
    });
    expect(route).not.toBeNull();

    const runtime = createPageRuntime(pageDsl, {
      route: { params: route!.params, query: route!.query },
    });
    const captured: Record<string, unknown>[] = [];
    runtime.context.actions.register('capture', (action) => {
      captured.push(action.params ?? {});
      return { ok: true };
    });

    // Action 引擎执行前以求值作用域解析 params，间接验证 route 作用域
    await runtime.engine.execute({
      action: 'capture',
      params: {
        id: '${route.params.id}',
        tab: '${route.query.tab}',
      },
    });

    expect(captured).toEqual([{ id: '123', tab: 'risk' }]);
    await runtime.destroy();
  });
});
