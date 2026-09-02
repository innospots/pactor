// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { PermissionStore } from '@pactor-app/permission';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { MenuRegistry, type MenuItem } from './menu.js';
import type { NavigationBridge } from './navigation.js';
import {
  DynamicDslRoute,
  useReactRouterBridge,
  type RenderPageArgs,
} from './react.js';

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
    permission: 'customer:edit',
  },
];

function renderAt(initialPath: string, element: ReactElement): void {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('DynamicDslRoute', () => {
  it('命中渲染页面：render 收到 { pageId, route }', () => {
    const registry = new MenuRegistry(menus);
    const renderPage = vi.fn((args: RenderPageArgs) => (
      <div>page:{args.pageId}</div>
    ));

    renderAt(
      '/customers',
      <DynamicDslRoute registry={registry} render={renderPage} />,
    );

    expect(screen.getByText('page:customer-list')).toBeTruthy();
    expect(renderPage).toHaveBeenCalledTimes(1);
    const args = renderPage.mock.calls[0]?.[0];
    expect(args?.pageId).toBe('customer-list');
    expect(args?.route.path).toBe('/customers');
    expect(args?.route.activeMenu).toBe('customer-list');
  });

  it('命中参数页：route.params 与 query 传入 render', () => {
    const registry = new MenuRegistry(menus);
    const store = new PermissionStore();
    store.setPermissions(['customer:edit']);
    const renderPage = vi.fn((_args: RenderPageArgs) => <div>edit</div>);

    renderAt(
      '/customers/123/edit?tab=risk',
      <DynamicDslRoute
        registry={registry}
        render={renderPage}
        permissionChecker={store}
      />,
    );

    const args = renderPage.mock.calls[0]?.[0];
    expect(args?.pageId).toBe('customer-edit');
    expect(args?.route.params).toEqual({ id: '123' });
    expect(args?.route.query).toEqual({ tab: 'risk' });
  });

  it('未命中渲染 fallback（404）', () => {
    const registry = new MenuRegistry(menus);
    const renderPage = vi.fn((_args: RenderPageArgs) => <div>page</div>);

    renderAt(
      '/not-registered',
      <DynamicDslRoute
        registry={registry}
        render={renderPage}
        fallback={<div>404</div>}
      />,
    );

    expect(screen.getByText('404')).toBeTruthy();
    expect(renderPage).not.toHaveBeenCalled();
  });

  it('无权限渲染 forbidden（403），不调用 render', () => {
    const registry = new MenuRegistry(menus);
    const store = new PermissionStore(); // 空权限集
    const renderPage = vi.fn((_args: RenderPageArgs) => <div>edit</div>);

    renderAt(
      '/customers/123/edit',
      <DynamicDslRoute
        registry={registry}
        render={renderPage}
        forbidden={<div>403</div>}
        permissionChecker={store}
      />,
    );

    expect(screen.getByText('403')).toBeTruthy();
    expect(renderPage).not.toHaveBeenCalled();
  });
});

describe('useReactRouterBridge', () => {
  it('push / replace 驱动 React Router 导航', () => {
    const bridgeHolder: { current?: NavigationBridge } = {};

    function Probe(): ReactElement {
      bridgeHolder.current = useReactRouterBridge();
      const location = bridgeHolder.current.getLocation();
      return (
        <div>
          <span data-testid="pathname">{location.pathname}</span>
          <button onClick={() => bridgeHolder.current?.push('/customers')}>
            push
          </button>
          <button
            onClick={() => bridgeHolder.current?.replace('/customers/123/edit')}
          >
            replace
          </button>
        </div>
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Probe />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('pathname').textContent).toBe('/');

    fireEvent.click(screen.getByText('push'));
    expect(screen.getByTestId('pathname').textContent).toBe('/customers');
    expect(bridgeHolder.current?.getLocation().pathname).toBe('/customers');

    fireEvent.click(screen.getByText('replace'));
    expect(screen.getByTestId('pathname').textContent).toBe(
      '/customers/123/edit',
    );
  });
});
