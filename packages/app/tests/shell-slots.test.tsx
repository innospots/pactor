// @vitest-environment jsdom
/**
 * application-shell：providers / headerExtra 应用级槽位。
 */
import './setup.js';

import { cleanup, screen, within } from '@testing-library/react';
import { StaticDslLoader } from 'pactor-resource';
import type { ReactNode } from 'react';
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

function createLoader() {
  return new StaticDslLoader({
    bootstrap: createBootstrap(),
    pages: standardPages,
  });
}

describe('application-shell：providers 槽位', () => {
  function SkinProvider({ children }: { children?: ReactNode }) {
    return <div data-testid="skin-provider">{children}</div>;
  }

  it('传入 providers：应用内容被其包装，Context 对 DSL 渲染树可见', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: createLoader(),
      providers: SkinProvider,
    });
    await mountApp(app);

    const wrapper = await screen.findByTestId('skin-provider');
    // DSL 页面内容渲染在 providers 包装之内
    expect(within(wrapper).getByText('欢迎使用 Pactor')).toBeTruthy();
  });

  it('缺省不传 providers：无额外包装层', async () => {
    setUrl('/');
    app = createPactorApplication({ appId: 'risk-admin', loader: createLoader() });
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    expect(screen.queryByTestId('skin-provider')).toBeNull();
  });
});

describe('application-shell：headerExtra 插槽', () => {
  it('admin 布局：headerExtra 渲染在头部', async () => {
    setUrl('/');
    app = createPactorApplication({
      appId: 'risk-admin',
      loader: createLoader(),
      headerExtra: <button data-testid="skin-settings">皮肤</button>,
    });
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    const extra = screen.getByTestId('skin-settings');
    expect(extra.closest('header')).not.toBeNull();
  });

  it('缺省不传 headerExtra：头部无插槽内容', async () => {
    setUrl('/');
    app = createPactorApplication({ appId: 'risk-admin', loader: createLoader() });
    await mountApp(app);

    await screen.findByText('欢迎使用 Pactor');
    expect(screen.queryByTestId('skin-settings')).toBeNull();
  });
});
