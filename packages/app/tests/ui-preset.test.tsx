// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import { StaticDslLoader } from 'pactor-resource';
import { shadcnUiKit } from 'pactor-ui';
import { createShadcnLayoutRegistry } from 'pactor-ui/layout';
import type { ReactNode } from 'react';
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

/** 含 message 与 overlay.open 动作的首页（复用 shell-kit 测试的断言模式） */
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
    appId: 'ui-preset-app',
    loader: new StaticDslLoader({
      bootstrap: createBootstrap({
        menus: [{ id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' }],
      }),
      pages: { home: shellPage },
    }),
    ...options,
  });
}

/** 自定义 admin 布局：用于验证显式 layoutRegistry 覆盖 ui 预设 */
function CustomAdminLayout({ children }: { children?: ReactNode }) {
  return <div className="custom-admin-layout">{children}</div>;
}

const customLayoutRegistry = () => {
  const registry = createShadcnLayoutRegistry();
  registry.unregister('admin');
  registry.register('admin', CustomAdminLayout);
  return registry;
};

describe('ui-kit-preset：ui 预设整站生效', () => {
  it('ui: shadcnUiKit 后页面组件 / 布局 / overlay.open / message 均为 shadcn（与缺省默认一致）', async () => {
    app = createShellApp({ ui: shadcnUiKit });
    const target = await mountApp(app);

    // 页面（shadcn 组件）就绪，外壳为 shadcn 布局
    await screen.findByRole('button', { name: '打开弹层' });
    expect(target.querySelector('[data-slot=admin-layout]')).not.toBeNull();
    const primaryButton = screen.getByRole('button', { name: '提示' });
    expect(primaryButton.className).toContain('bg-primary');

    // message → shadcn toast（先触发，避免 Dialog 打开后外部内容 aria-hidden）
    fireEvent.click(screen.getByRole('button', { name: '提示' }));
    await screen.findByText('保存成功');
    expect(
      document.querySelector('[data-slot=toast][data-type=success]'),
    ).not.toBeNull();

    // overlay.open → shadcn Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('[data-slot=overlay-modal]')).not.toBeNull();
    await screen.findByRole('button', { name: '弹层按钮' });
  });

  it('不传 ui（仅 api/loader）：行为与 shadcnUiKit 一致（缺省即唯一内置实现）', async () => {
    app = createShellApp();
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '打开弹层' });
    expect(target.querySelector('[data-slot=admin-layout]')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('[data-slot=overlay-modal]')).not.toBeNull();
  });
});

describe('ui-kit-preset：显式选项覆盖预设', () => {
  it('ui: shadcnUiKit + 显式 layoutRegistry：布局用显式值，组件与交互层仍为预设', async () => {
    app = createShellApp({
      ui: shadcnUiKit,
      layoutRegistry: customLayoutRegistry,
    });
    const target = await mountApp(app);

    // 布局槽位被显式值覆盖：自定义布局生效，shadcn 外壳未渲染
    await screen.findByRole('button', { name: '打开弹层' });
    expect(target.querySelector('.custom-admin-layout')).not.toBeNull();
    expect(target.querySelector('[data-slot=admin-layout]')).toBeNull();

    // 组件槽位仍为 shadcn 预设
    const primaryButton = screen.getByRole('button', { name: '提示' });
    expect(primaryButton.className).toContain('bg-primary');

    // 交互层槽位仍为 shadcn 预设：overlay.open 渲染 shadcn Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('[data-slot=overlay-modal]')).not.toBeNull();
  });
});
