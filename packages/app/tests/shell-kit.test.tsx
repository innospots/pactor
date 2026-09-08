// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import { StaticDslLoader } from '@pactor-app/resource';
import { createLayoutRegistry } from '@pactor-app/ui/layout';
import type {
  InteractionProviderProps,
  OverlayHostProps,
} from '@pactor-app/ui/interaction';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createPactorApplication,
  type PactorApplication,
} from '../src/index.js';
import { createBootstrap, mountApp, setUrl, unmountApp } from './helpers.js';

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

/** 含 message 与 overlay.open 动作的首页 */
const shellPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'home', title: '首页' },
  body: {
    type: 'Page',
    props: { title: '首页' },
    children: [
      {
        type: 'Button',
        props: { text: '提示', variant: 'primary' },
        events: {
          onClick: {
            action: 'message',
            params: { type: 'success', text: '保存成功' },
          },
        },
      },
      {
        type: 'Button',
        props: { text: '打开弹层' },
        events: {
          onClick: {
            action: 'overlay.open',
            params: {
              overlay: {
                type: 'modal',
                title: '用户详情',
                content: { type: 'Button', props: { text: '弹层按钮' } },
              },
            },
          },
        },
      },
    ],
  },
};

function createShellApp(
  options: Record<string, unknown> = {},
): PactorApplication {
  setUrl('/');
  return createPactorApplication({
    appId: 'shell-app',
    loader: new StaticDslLoader({
      bootstrap: createBootstrap({
        menus: [{ id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' }],
      }),
      pages: { home: shellPage },
    }),
    ...options,
  });
}

/** 自定义交互层 Provider：注入极简 message 实现（DOM 标记），验证 interactionKit 覆盖点 */
function CustomInteractionProvider({
  bridge,
  children,
}: InteractionProviderProps) {
  useEffect(() => {
    const push = (content: unknown) => {
      const el = document.createElement('div');
      el.className = 'custom-toast';
      el.textContent = String(content);
      document.body.appendChild(el);
    };
    bridge.message = {
      success: push,
      error: push,
      info: push,
      warning: push,
    };
    return () => {
      bridge.message = undefined;
      bridge.modal = undefined;
    };
  }, [bridge]);
  return <>{children}</>;
}

/** 自定义 OverlayHost：极简渲染堆栈条目（仅标题），验证 interactionKit 覆盖点 */
function CustomOverlayHost({ manager }: OverlayHostProps) {
  const stack = useSyncExternalStore(
    (onChange) => manager.subscribe(onChange),
    () => manager.stack(),
  );
  return (
    <>
      {stack.map((entry) => (
        <div key={entry.id} className="custom-modal">
          {entry.title}
        </div>
      ))}
    </>
  );
}

const customInteractionKit = {
  Provider: CustomInteractionProvider,
  OverlayHost: CustomOverlayHost,
};

/** 自定义布局注册表：admin 替换为极简实现 */
function CustomAdminLayout({ children }: { children?: ReactNode }) {
  return <div className="custom-admin-layout">{children}</div>;
}

const customLayoutRegistry = () => {
  const registry = createLayoutRegistry();
  registry.unregister('admin');
  registry.register('admin', CustomAdminLayout);
  return registry;
};

describe('shell-ui-kit-selection：缺省为内置实现', () => {
  it('不传 layoutRegistry / interactionKit：外壳为 AdminLayout，overlay.open 渲染内置 Modal', async () => {
    app = createShellApp();
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '打开弹层' });
    // 外壳为内置布局（data-slot 钩子）
    expect(target.querySelector('[data-slot=admin-layout]')).not.toBeNull();
    expect(target.querySelector('[data-slot=menu]')).not.toBeNull();

    // 交互层为内置实现：overlay.open 渲染内置 Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('[data-slot=overlay-modal]')).not.toBeNull();
  });
});

describe('shell-ui-kit-selection：自定义覆盖点保留', () => {
  it('layoutRegistry 切换：外壳渲染自定义布局', async () => {
    app = createShellApp({ layoutRegistry: customLayoutRegistry });
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '提示' });
    expect(target.querySelector('.custom-admin-layout')).not.toBeNull();
    expect(target.querySelector('[data-slot=admin-layout]')).toBeNull();
  });

  it('interactionKit 切换：message / overlay.open 链路走自定义实现', async () => {
    app = createShellApp({ interactionKit: customInteractionKit });
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '打开弹层' });
    // 外壳仍为内置默认布局
    expect(target.querySelector('[data-slot=admin-layout]')).not.toBeNull();

    // message → 自定义 toast
    fireEvent.click(screen.getByRole('button', { name: '提示' }));
    await screen.findByText('保存成功');
    expect(document.querySelector('.custom-toast')).not.toBeNull();
    expect(document.querySelector('[data-slot=toast]')).toBeNull();

    // overlay.open → 自定义 modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('.custom-modal')).not.toBeNull();
    expect(document.querySelector('[data-slot=overlay-modal]')).toBeNull();
  });
});

describe('shell-ui-kit-selection：chat 布局接线', () => {
  it("bootstrap layout.type: 'chat' 时布局收到 registry/bridge 并渲染菜单", async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'shell-app',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'home', type: 'page', title: '对话', path: '/', pageId: 'home' },
            { id: 'agents', type: 'page', title: '智能体', path: '/agents', pageId: 'agents' },
          ],
          layout: { type: 'chat' },
        }),
        pages: {
          home: shellPage,
          agents: {
            dsl: '1.0',
            page: { id: 'agents', title: '智能体' },
            body: { type: 'Page', props: { title: '智能体' }, children: [] },
          },
        },
      }),
    });
    const target = await mountApp(app);

    // chat 布局渲染：Sidebar 外壳 + 菜单项
    await screen.findByText('对话');
    expect(target.querySelector('[data-slot=sidebar-layout]')).not.toBeNull();
    expect(screen.getByText('智能体')).toBeTruthy();
    // 当前路径 / 命中「对话」菜单项高亮
    const homeItem = screen.getByText('对话').closest('button');
    expect(homeItem?.getAttribute('aria-current')).toBe('page');
  });
});
