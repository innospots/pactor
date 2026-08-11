// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import { StaticDslLoader } from 'pactor-resource';
import { antdUiKit } from 'pactor-ui-antd';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createPactorApplication,
  type PactorApplication,
  type UiKit,
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
    ],
  },
};

describe('ui-kit-antd-preset：ui: antdUiKit 与默认行为一致', () => {
  it('与 pactor-app 的 UiKit 类型编译期兼容', () => {
    const kit: UiKit = antdUiKit;
    expect(kit.componentRegistry).toBeDefined();
  });

  it('显式 antd 预设：渲染 antd 元素（.ant-* 存在，无 .pcr-*）', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'ui-antd-preset-app',
      ui: antdUiKit,
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' },
          ],
        }),
        pages: { home: shellPage },
      }),
    });
    const target = await mountApp(app);

    // 页面（antd 组件）就绪，外壳为 antd 布局
    // （antd 对两个汉字的按钮自动插空格，名称用正则匹配）
    await screen.findByRole('button', { name: /提\s*示/ });
    expect(target.querySelector('.ant-layout')).not.toBeNull();
    expect(target.querySelector('.ant-btn')).not.toBeNull();

    // message → antd message
    fireEvent.click(screen.getByRole('button', { name: /提\s*示/ }));
    await screen.findByText('保存成功');
    expect(document.querySelector('.ant-message')).not.toBeNull();

    // 无 Radix 渲染产物
    expect(target.querySelector('.pcr-admin-layout')).toBeNull();
    expect(document.querySelector('.pcr-btn-primary')).toBeNull();
  });
});
