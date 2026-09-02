// @vitest-environment jsdom
import './setup.js';

import { cleanup, screen } from '@testing-library/react';
import type { PageDsl } from '@pactor/core';
import { Registry } from '@pactor/core';
import { StaticDslLoader } from '@pactor/resource';
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

/** 含 Button / Statistic 的首页 */
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

/** 全自定义组件注册表（验证 componentRegistry 覆盖点可整体替换内置实现） */
function createCustomComponentRegistry(): Registry<unknown> {
  const registry = new Registry<unknown>('ComponentRegistry');
  registry.register('Page', ({ children }: { children?: ReactNode }) => (
    <div className="custom-page">{children}</div>
  ));
  registry.register('Button', ({ text }: { text?: string }) => (
    <button type="button" className="custom-btn">
      {text}
    </button>
  ));
  registry.register(
    'Statistic',
    ({ title, value }: { title?: string; value?: number | string }) => (
      <div className="custom-statistic">
        {title}:{value}
      </div>
    ),
  );
  return registry;
}

describe('ui-kit-selection：componentRegistry 选项', () => {
  it('缺省为 shadcn：不传 componentRegistry 渲染 shadcn 实现（@pactor/ui，唯一内置实现）', async () => {
    app = createAppWithKit();
    const target = await mountApp(app);

    const button = await screen.findByRole('button', { name: '保存' });
    // variant: primary → shadcn default 变体（bg-primary 工具类）
    expect(button.className).toContain('bg-primary');
    expect(target.querySelector('[data-slot=statistic]')).not.toBeNull();
  });

  it('传入自定义注册表：整体替换内置 shadcn 实现', async () => {
    app = createAppWithKit({ componentRegistry: createCustomComponentRegistry });
    const target = await mountApp(app);

    await screen.findByRole('button', { name: '保存' });
    expect(target.querySelector('.custom-btn')).not.toBeNull();
    expect(target.querySelector('.custom-statistic')).not.toBeNull();
    // 内置 shadcn 实现未渲染
    expect(target.querySelector('[data-slot=statistic]')).toBeNull();
  });

  it('业务组件叠加：options.components 自定义组件与内置 shadcn 组件同页可用', async () => {
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
      components: { RiskScore },
    });
    const target = await mountApp(app);

    await screen.findByText('风险分:86');
    // 内置组件仍为 shadcn 实现
    const button = screen.getByRole('button', { name: '保存' });
    expect(button.className).toContain('bg-primary');
    expect(target.querySelector('[data-testid=risk-score]')).not.toBeNull();
  });
});
