// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import { StaticDslLoader } from '@pactor-app/resource';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createPactorApplication,
  type PactorApplication,
} from '../src/index.js';
import {
  createBootstrap,
  failBootstrapOnceLoader,
  mountApp,
  setUrl,
  standardMenus,
  standardPages,
  unmountApp,
} from './helpers.js';

let app: PactorApplication | null = null;

afterEach(async () => {
  if (app !== null) {
    await unmountApp(app);
    app = null;
  }
  cleanup();
  document.body.innerHTML = '';
  window.history.replaceState({}, '', '/');
});

describe('application-bootstrap：启动编排', () => {
  it('完整启动：渲染布局外壳、菜单与页面内容（user/app 注入表达式作用域）', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap(),
        pages: standardPages,
      }),
    });
    const target = await mountApp(app);

    // 页面内容与表达式（user/app 作用域）
    await screen.findByText('欢迎使用 Pactor');
    expect(
      screen.getByText('你好 张三，欢迎来到 风控运营平台'),
    ).toBeTruthy();
    // 布局外壳：品牌区取 bootstrap.app.name
    expect(
      target.querySelector('[data-slot=admin-brand]')?.textContent,
    ).toBe('风控运营平台');
    // 菜单：sys:admin 无权限被过滤、隐藏页不可见 → 首页 / 客户管理两项
    const menuItems = target.querySelectorAll('[data-slot=menu-item]');
    expect(menuItems).toHaveLength(2);
  });

  it('bootstrap 失败：渲染启动错误页，点击重试重新加载', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: failBootstrapOnceLoader(
        new StaticDslLoader({
          bootstrap: createBootstrap(),
          pages: standardPages,
        }),
      ),
    });
    await mountApp(app);

    // 受控启动错误页（不白屏）
    await screen.findByText('应用启动失败');
    expect(screen.getByText('网络异常：bootstrap 加载失败')).toBeTruthy();

    // 重试后正常启动
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    await screen.findByText('欢迎使用 Pactor');
  });

  it('缺省字段：bootstrap 无 permissions/menus 时正常启动、菜单为空', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'empty-app',
      loader: new StaticDslLoader({
        bootstrap: { app: { name: '空应用' } },
        pages: standardPages,
      }),
    });
    const target = await mountApp(app);

    // 外壳正常（brand 取 bootstrap.app.name），路径未注册 → 404
    await screen.findByText('页面不存在或尚未注册');
    expect(
      target.querySelector('[data-slot=admin-brand]')?.textContent,
    ).toBe('空应用');
    expect(target.querySelectorAll('[data-slot=menu-item]')).toHaveLength(0);
  });

  it('i18n 配置：options.locale/messages 注入页面表达式作用域', async () => {
    const i18nPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Page',
        children: [
          {
            type: 'Text',
            props: { value: "${t('welcome')}" },
          },
        ],
      },
    };
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({ menus: [standardMenus[0]] }),
        pages: { home: i18nPage },
      }),
      components: {
        Text: ({ value }: { value?: string }) => <span>{value}</span>,
      },
      locale: 'en-US',
      messages: { welcome: 'Hello, Pactor!' },
    });
    await mountApp(app);

    await screen.findByText('Hello, Pactor!');
  });
});

describe('application-bootstrap：共享注册表与页面运行时工厂', () => {
  function RiskScore(props: { score?: number }) {
    return <span data-testid="risk-score">风险分:{props.score}</span>;
  }

  const pageA: PageDsl = {
    dsl: '1.0',
    page: { id: 'page-a', title: '页面A' },
    body: {
      type: 'Page',
      children: [{ type: 'RiskScore', props: { score: 86 } }],
    },
  };
  const pageB: PageDsl = {
    dsl: '1.0',
    page: { id: 'page-b', title: '页面B' },
    body: {
      type: 'Page',
      children: [{ type: 'RiskScore', props: { score: 99 } }],
    },
  };

  it('业务组件跨页面可用：options.components 注册的组件被所有页面共享', async () => {
    setUrl('/a');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'a', type: 'page', title: '页面A', path: '/a', pageId: 'page-a' },
            { id: 'b', type: 'page', title: '页面B', path: '/b', pageId: 'page-b' },
          ],
        }),
        pages: { 'page-a': pageA, 'page-b': pageB },
      }),
      components: { RiskScore },
    });
    await mountApp(app);

    await screen.findByText('风险分:86');
    fireEvent.click(screen.getByText('页面B'));
    await screen.findByText('风险分:99');
  });

  it('route context 注入：${route.params.id} 与 ${route.query.tab} 求值', async () => {
    setUrl('/customers/123?tab=risk');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap(),
        pages: standardPages,
      }),
    });
    await mountApp(app);

    await screen.findByText('客户 123 页签 risk');
  });

  it('页面权限生效：无权限组件按 denied 策略隐藏', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        // permissions 不含 risk:view
        bootstrap: createBootstrap({ permissions: ['customer:view'] }),
        pages: standardPages,
      }),
    });
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    expect(screen.queryByText('高危操作')).toBeNull();
  });

  it('setState 动作：点击按钮更新 state 并驱动条件渲染', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap(),
        pages: standardPages,
      }),
    });
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    expect(screen.queryByText('状态已更新')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '修改状态' }));
    await screen.findByText('状态已更新');
  });
});

describe('application-bootstrap：扩展注册 API 与 mount/unmount', () => {
  it('运行期注册动作：registerAction 后页面执行该动作命中 handler', async () => {
    const actionPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Page',
        children: [
          {
            type: 'Button',
            props: { text: '业务动作', variant: 'primary' },
            events: { onClick: { action: 'my.action' } },
          },
        ],
      },
    };
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({ menus: [standardMenus[0]] }),
        pages: { home: actionPage },
      }),
    });
    await mountApp(app);
    await screen.findByRole('button', { name: '业务动作' });

    const handler = vi.fn(() => ({ ok: true as const }));
    app.registerAction('my.action', handler);
    fireEvent.click(screen.getByRole('button', { name: '业务动作' }));
    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  it('挂载与卸载：mount 渲染内容，unmount 清空容器；重复 mount 先卸载', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap(),
        pages: standardPages,
      }),
    });
    const target = await mountApp(app);
    await screen.findByText('欢迎使用 Pactor');
    expect(target.innerHTML).not.toBe('');

    // 重复 mount：先卸载旧根再挂载
    await mountApp(app);
    await screen.findByText('欢迎使用 Pactor');

    // 卸载后容器清空
    await unmountApp(app);
    expect(target.innerHTML).toBe('');
  });
});
