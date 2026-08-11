// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import { createLayoutRegistry } from 'pactor-ui-antd/layout';
import { StaticDslLoader } from 'pactor-resource';
import { radixUiKit } from 'pactor-ui-radix';
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
  const registry = createLayoutRegistry();
  registry.unregister('admin');
  registry.register('admin', CustomAdminLayout);
  return registry;
};

describe('ui-kit-preset：ui 预设整站生效', () => {
  it('ui: radixUiKit 后页面组件 / 布局 / overlay.open / message 均为 Radix（.pcr-* 存在，无 .ant-*）', async () => {
    app = createShellApp({ ui: radixUiKit });
    const target = await mountApp(app);

    // 页面（Radix 组件）就绪，外壳为 Radix 布局
    await screen.findByRole('button', { name: '打开弹层' });
    expect(target.querySelector('.pcr-admin-layout')).not.toBeNull();
    expect(target.querySelector('.pcr-btn-primary')).not.toBeNull();

    // message → Radix toast（先触发，避免 Dialog 打开后外部内容 aria-hidden）
    fireEvent.click(screen.getByRole('button', { name: '提示' }));
    await screen.findByText('保存成功');
    expect(document.querySelector('.pcr-toast-success')).not.toBeNull();

    // overlay.open → Radix Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('.pcr-modal-content')).not.toBeNull();
    await screen.findByRole('button', { name: '弹层按钮' });

    // 全站无 antd 渲染产物
    expect(document.querySelector('.ant-layout')).toBeNull();
    expect(document.querySelector('.ant-menu')).toBeNull();
    expect(document.querySelector('.ant-modal')).toBeNull();
    expect(document.querySelector('.ant-message')).toBeNull();
    expect(document.querySelector('.ant-btn')).toBeNull();
  });
});

describe('ui-kit-preset：显式选项覆盖预设', () => {
  it('ui: radixUiKit + 显式 layoutRegistry：布局用显式值，组件与交互层仍为 Radix 预设', async () => {
    app = createShellApp({
      ui: radixUiKit,
      layoutRegistry: customLayoutRegistry,
    });
    const target = await mountApp(app);

    // 布局槽位被显式值覆盖：自定义布局生效，Radix 外壳未渲染
    await screen.findByRole('button', { name: '打开弹层' });
    expect(target.querySelector('.custom-admin-layout')).not.toBeNull();
    expect(target.querySelector('.pcr-admin-layout')).toBeNull();

    // 组件槽位仍为 Radix 预设
    expect(target.querySelector('.pcr-btn-primary')).not.toBeNull();

    // 交互层槽位仍为 Radix 预设：overlay.open 渲染 Radix Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('.pcr-modal-content')).not.toBeNull();
    expect(document.querySelector('.ant-modal')).toBeNull();
  });
});
