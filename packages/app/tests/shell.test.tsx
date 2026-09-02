// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import type { DslResourceLoader } from '@pactor-app/resource';
import { StaticDslLoader } from '@pactor-app/resource';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createPactorApplication,
  type PactorApplication,
} from '../src/index.js';
import {
  createBootstrap,
  mountApp,
  setUrl,
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

function createStandardApp() {
  return createPactorApplication({
    appId: 'risk-admin',
    loader: new StaticDslLoader({
      bootstrap: createBootstrap(),
      pages: standardPages,
    }),
  });
}

describe('application-shell：动态路由集成', () => {
  it('菜单导航渲染页面：点击菜单项经 bridge 导航并渲染对应 DSL 页面', async () => {
    setUrl('/');
    app = createStandardApp();
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    fireEvent.click(screen.getByText('客户管理'));
    await screen.findByText('客户列表页内容');
  });

  it('未注册路径 404', async () => {
    setUrl('/no-such-path');
    app = createStandardApp();
    await mountApp(app);

    await screen.findByText('页面不存在或尚未注册');
    expect(document.querySelector('.pactor-app-not-found')).not.toBeNull();
  });

  it('无权限 403：命中页面但权限不足时渲染 403 提示', async () => {
    setUrl('/admin');
    app = createStandardApp();
    await mountApp(app);

    await screen.findByText('没有访问该页面的权限');
    expect(document.querySelector('.pactor-app-forbidden')).not.toBeNull();
    // 403 不渲染页面内容
    expect(screen.queryByText('系统管理页内容')).toBeNull();
  });
});

describe('application-shell：页面加载与错误处理', () => {
  it('加载失败渲染受控错误页，重试后恢复', async () => {
    const fixedPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'broken-page', title: '故障页' },
      body: {
        type: 'Page',
        children: [
          { type: 'Alert', props: { variant: 'success', message: '修复后的页面' } },
        ],
      },
    };
    // 页面先不可用（loadPage reject），置位后恢复
    let available = false;
    const inner = new StaticDslLoader({
      bootstrap: createBootstrap({
        menus: [
          { id: 'broken', type: 'page', title: '故障页', path: '/broken', pageId: 'broken-page' },
        ],
      }),
      pages: { 'broken-page': fixedPage },
    });
    const loader: DslResourceLoader = {
      loadBootstrap: () => inner.loadBootstrap(),
      loadFragment: (id) => inner.loadFragment(id),
      loadPage: (id) => {
        if (!available) {
          return Promise.reject(new Error('网络异常：页面加载失败'));
        }
        return inner.loadPage(id);
      },
    };

    setUrl('/broken');
    app = createPactorApplication({ appId: 'risk-admin', loader });
    await mountApp(app);

    await screen.findByText('页面加载失败');
    expect(screen.getByText('网络异常：页面加载失败')).toBeTruthy();

    available = true;
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    await screen.findByText('修复后的页面');
  });

  it('渲染异常被 ErrorBoundary 捕获：显示错误页，应用外壳不崩溃', async () => {
    function Boom(): never {
      throw new Error('组件爆炸');
    }
    const boomPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'boom-page', title: '异常页' },
      body: {
        type: 'Page',
        children: [{ type: 'Boom' }],
      },
    };
    setUrl('/boom');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'boom', type: 'page', title: '异常页', path: '/boom', pageId: 'boom-page' },
          ],
        }),
        pages: { 'boom-page': boomPage },
      }),
      components: { Boom },
    });
    const target = await mountApp(app);

    await screen.findByText('页面渲染异常');
    // 外壳（品牌区 / 菜单）仍在
    expect(
      target.querySelector('[data-slot=admin-brand]')?.textContent,
    ).toBe('风控运营平台');
    expect(target.querySelectorAll('[data-slot=menu-item]')).toHaveLength(1);
  });
});

describe('application-shell：布局包裹', () => {
  it('admin 外壳包裹页面：内容区渲染页面，菜单与页签可见', async () => {
    setUrl('/');
    app = createStandardApp();
    const target = await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    // 页签（bootstrap.layout.tabs: true）
    const tabs = target.querySelector('[data-slot=admin-tabs]');
    expect(tabs).not.toBeNull();
    expect(within(tabs as HTMLElement).getByText('首页')).toBeTruthy();
    // 页面内容在 AdminLayout 内容区
    const content = target.querySelector('[data-slot=admin-content]');
    expect(content?.textContent).toContain('欢迎使用 Pactor');
    // 菜单可见
    expect(target.querySelectorAll('[data-slot=menu-item]').length).toBeGreaterThan(0);
  });

  it('bootstrap.layout 布局配置透传：mode top-bottom 无侧边栏，collapsible 出现收起 trigger', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          layout: { type: 'admin', mode: 'top-bottom', footer: true },
        }),
        pages: standardPages,
      }),
    });
    const target = await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    const layout = target.querySelector('[data-slot=admin-layout]');
    expect(layout?.getAttribute('data-mode')).toBe('top-bottom');
    expect(target.querySelector('[data-slot=admin-sidebar]')).toBeNull();
    expect(target.querySelector('[data-slot=admin-footer]')).not.toBeNull();
    await unmountApp(app);
    app = null;
    cleanup();
    document.body.innerHTML = '';

    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          layout: { type: 'admin', collapsible: true },
        }),
        pages: standardPages,
      }),
    });
    const target2 = await mountApp(app);
    await screen.findByText('欢迎使用 Pactor');
    expect(
      target2.querySelector('[data-slot=admin-collapse-trigger]'),
    ).not.toBeNull();
  });
});

describe('application-shell：Overlay 与交互集成', () => {
  const overlayPage: PageDsl = {
    dsl: '1.0',
    page: { id: 'overlay-page', title: '弹层页面' },
    body: {
      type: 'Page',
      children: [
        {
          type: 'Alert',
          props: { variant: 'info', message: '弹层页面内容 ${params.id}' },
        },
      ],
    },
  };

  const interactionHome: PageDsl = {
    dsl: '1.0',
    page: { id: 'home', title: '首页' },
    body: {
      type: 'Page',
      props: { title: '首页' },
      children: [
        {
          type: 'Button',
          props: { text: '打开弹层', variant: 'primary' },
          events: {
            onClick: {
              action: 'overlay.open',
              params: {
                overlay: {
                  type: 'modal',
                  title: '编辑客户',
                  content: {
                    type: 'Alert',
                    props: { variant: 'info', message: '弹层内的 DSL 内容' },
                  },
                },
              },
            },
          },
        },
        {
          type: 'Button',
          props: { text: '打开页面弹层' },
          events: {
            onClick: {
              action: 'overlay.open',
              params: {
                overlay: {
                  type: 'drawer',
                  title: '页面抽屉',
                  params: { id: 7 },
                  page: { pageId: 'overlay-page' },
                },
              },
            },
          },
        },
        {
          type: 'Button',
          props: { text: '提示' },
          events: {
            onClick: {
              action: 'message',
              params: { type: 'success', text: '操作成功' },
            },
          },
        },
      ],
    },
  };

  async function mountInteractionApp() {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' },
          ],
        }),
        pages: { home: interactionHome, 'overlay-page': overlayPage },
      }),
    });
    await mountApp(app);
    await screen.findByRole('button', { name: '打开弹层' });
  }

  it('页面内打开 overlay：Modal 渲染 DSL content', async () => {
    await mountInteractionApp();

    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('编辑客户');
    await screen.findByText('弹层内的 DSL 内容');
  });

  it('page 类型 overlay：经 loader 加载页面 DSL 并渲染（共享 registries）', async () => {
    await mountInteractionApp();

    fireEvent.click(screen.getByRole('button', { name: '打开页面弹层' }));
    await screen.findByText('页面抽屉');
    await screen.findByText('弹层页面内容 7');
  });

  it('message 动作：toast 出现对应提示', async () => {
    await mountInteractionApp();

    fireEvent.click(screen.getByRole('button', { name: '提示' }));
    await screen.findByText('操作成功');
  });
});
