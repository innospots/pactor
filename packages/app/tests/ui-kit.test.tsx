// @vitest-environment jsdom
import './setup.js';

import { cleanup, screen } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import { createRadixComponentRegistry } from 'pactor-ui-radix/components';
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

/** 含 Button / Statistic 的首页（两套 UI kit 契约一致，DSL 零修改） */
const kitPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'home', title: '首页' },
  body: {
    type: 'Page',
    props: { title: '首页' },
    children: [
      { type: 'Button', props: { text: '保存', variant: 'primary' } },
      { type: 'Statistic', props: { title: '总数', value: 128 } },
    ],
  },
};

function createAppWithKit(
  options: Record<string, unknown> = {},
): PactorApplication {
  setUrl('/');
  return createPactorApplication({
    appId: 'kit-app',
    loader: new StaticDslLoader({
      bootstrap: createBootstrap({
        menus: [{ id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' }],
      }),
      pages: { home: kitPage },
    }),
    ...options,
  });
}

describe('ui-kit-selection：componentRegistry 选项', () => {
  it('缺省仍为 antd：不传 componentRegistry 渲染 antd 实现', async () => {
    app = createAppWithKit();
    const target = await mountApp(app);

    await screen.findByRole('button', { name: /保\s*存/ });
    expect(target.querySelector('.ant-btn-primary')).not.toBeNull();
    expect(target.querySelector('.pcr-btn')).toBeNull();
  });

  it('切换 Radix：渲染结果为 Radix 实现（pcr 语义 class 存在）', async () => {
    app = createAppWithKit({ componentRegistry: createRadixComponentRegistry });
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '保存' });
    expect(target.querySelector('.pcr-btn-primary')).not.toBeNull();
    expect(target.querySelector('.pcr-statistic')).not.toBeNull();
    expect(target.querySelector('.ant-btn')).toBeNull();
  });

  it('业务组件叠加：切换 Radix 后 options.components 自定义组件与内置组件同页可用', async () => {
    function RiskScore(props: { score?: number }) {
      return <span data-testid="risk-score">风险分:{props.score}</span>;
    }
    const page: PageDsl = {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Page',
        children: [
          { type: 'Button', props: { text: '保存', variant: 'primary' } },
          { type: 'RiskScore', props: { score: 86 } },
        ],
      },
    };
    setUrl('/');
    app = createPactorApplication({
      appId: 'kit-app',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [
            { id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' },
          ],
        }),
        pages: { home: page },
      }),
      componentRegistry: createRadixComponentRegistry,
      components: { RiskScore },
    });
    const target = await mountApp(app);

    await screen.findByText('风险分:86');
    expect(target.querySelector('.pcr-btn-primary')).not.toBeNull();
  });
});
