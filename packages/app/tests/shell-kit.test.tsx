// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import { createRadixComponentRegistry } from 'pactor-ui-radix/components';
import {
  RadixInteractionProvider,
  RadixOverlayHost,
} from 'pactor-ui-radix/interaction';
import { createRadixLayoutRegistry } from 'pactor-ui-radix/layout';
import { StaticDslLoader } from 'pactor-resource';
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

/** 含 message 与 overlay.open 动作的首页（两套 UI kit 契约一致，DSL 零修改） */
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

const radixKit = {
  componentRegistry: createRadixComponentRegistry,
  layoutRegistry: createRadixLayoutRegistry,
  interactionKit: {
    Provider: RadixInteractionProvider,
    OverlayHost: RadixOverlayHost,
  },
};

describe('shell-ui-kit-selection：缺省仍为 antd', () => {
  it('不传 layoutRegistry / interactionKit：外壳为 antd AdminLayout，overlay.open 渲染 antd Modal', async () => {
    app = createShellApp();
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '打开弹层' });
    // 外壳为 antd 布局
    expect(target.querySelector('.ant-layout')).not.toBeNull();
    expect(target.querySelector('.ant-menu')).not.toBeNull();
    expect(target.querySelector('.pcr-admin-layout')).toBeNull();

    // 交互层为 antd：overlay.open 渲染 antd Modal
    fireEvent.click(screen.getByRole('button', { name: '打开弹层' }));
    await screen.findByText('用户详情');
    expect(document.querySelector('.ant-modal')).not.toBeNull();
    expect(document.querySelector('.pcr-modal-content')).toBeNull();
  });
});

describe('shell-ui-kit-selection：切换 Radix 外壳', () => {
  it('layoutRegistry 切换：外壳渲染 Radix 布局（.pcr-admin-* 存在，无 .ant-layout）', async () => {
    app = createShellApp({ layoutRegistry: createRadixLayoutRegistry });
    const target = await mountApp(app);

    await screen.findByRole('button', { name: /提\s*示/ });
    expect(target.querySelector('.pcr-admin-layout')).not.toBeNull();
    expect(target.querySelector('.pcr-admin-header')).not.toBeNull();
    expect(target.querySelector('.pcr-admin-sidebar')).not.toBeNull();
    expect(target.querySelector('.ant-layout')).toBeNull();
  });

  it('整站 Radix 切换：overlay.open 与 message 链路可用且均为 Radix 渲染，无 .ant-* 元素', async () => {
    app = createShellApp(radixKit);
    const target = await mountApp(app);

    // 页面（Radix 组件）就绪
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
