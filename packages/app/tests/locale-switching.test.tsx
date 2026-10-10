// @vitest-environment jsdom
import './setup.js';

import { act, cleanup, screen } from '@testing-library/react';
import type { I18nMessages, PageDsl } from '@pactor-app/core';
import { StaticDslLoader } from '@pactor-app/resource';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPactorApplication,
  createLocalStorageLocaleStorage,
  type LocaleStorage,
  type PactorApplication,
} from '../src/index.js';
import {
  createBootstrap,
  mountApp,
  setUrl,
  standardMenus,
  unmountApp,
} from './helpers.js';

let app: PactorApplication | null = null;

/** 按语言分组的 bootstrap messages：zh-CN / en-US / fr-FR 各一条 welcome */
const localeMessages = {
  'zh-CN': { welcome: '欢迎' },
  'en-US': { welcome: 'Welcome' },
  'fr-FR': { welcome: 'Bienvenue' },
};

/** 渲染 ${t('welcome')} 的页面 */
function welcomePage(): PageDsl {
  return {
    dsl: '1.0',
    page: { id: 'home', title: '首页' },
    body: {
      type: 'Page',
      children: [{ type: 'Text', props: { value: "${t('welcome')}" } }],
    },
  };
}

/** 组装默认应用：bootstrap 语言与 messages 可覆盖 */
function createApp(overrides: {
  bootstrap?: Record<string, unknown>;
  locale?: string;
  messages?: I18nMessages;
  localeStorage?: LocaleStorage | false;
}): PactorApplication {
  return createPactorApplication({
    appId: 'risk-admin',
    loader: new StaticDslLoader({
      bootstrap: createBootstrap({
        menus: [standardMenus[0]],
        ...overrides.bootstrap,
      }),
      pages: { home: welcomePage() },
    }),
    components: {
      Text: ({ value }: { value?: string }) => <span>{value}</span>,
    },
    locale: overrides.locale,
    messages: overrides.messages,
    localeStorage: overrides.localeStorage,
  });
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(async () => {
  if (app !== null) {
    await unmountApp(app);
    app = null;
  }
  cleanup();
  document.body.innerHTML = '';
  window.history.replaceState({}, '', '/');
  localStorage.clear();
});

describe('locale 解析链（设计 D5）：options > 持久化 > bootstrap > 浏览器语言 > zh-CN', () => {
  it('options.locale 覆盖持久化值', async () => {
    localStorage.setItem('pactor.locale', 'en-US');
    setUrl('/');
    app = createApp({
      locale: 'zh-CN',
      bootstrap: { locale: 'fr-FR', messages: localeMessages },
    });
    await mountApp(app);

    await screen.findByText('欢迎');
  });

  it('持久化值覆盖 bootstrap 与浏览器语言', async () => {
    localStorage.setItem('pactor.locale', 'en-US');
    setUrl('/');
    app = createApp({
      bootstrap: { locale: 'fr-FR', messages: localeMessages },
    });
    await mountApp(app);

    await screen.findByText('Welcome');
  });

  it('无存储时回退现状行为：bootstrap 优先于浏览器语言', async () => {
    setUrl('/');
    app = createApp({
      bootstrap: { locale: 'fr-FR', messages: localeMessages },
    });
    await mountApp(app);

    await screen.findByText('Bienvenue');
  });

  it('自定义适配器：启动时经 get() 读取持久化语言', async () => {
    const custom: LocaleStorage = {
      get: vi.fn(() => 'en-US'),
      set: vi.fn(),
    };
    setUrl('/');
    app = createApp({
      localeStorage: custom,
      bootstrap: { locale: 'fr-FR', messages: localeMessages },
    });
    await mountApp(app);

    await screen.findByText('Welcome');
    expect(custom.get).toHaveBeenCalled();
  });

  it('默认 localStorage 工厂：key 可更换，按自定义 key 读写', async () => {
    const storage = createLocalStorageLocaleStorage('my-app.locale');
    storage.set('en-US');
    expect(localStorage.getItem('my-app.locale')).toBe('en-US');
    expect(storage.get()).toBe('en-US');
    // 缺省 key 未被写入
    expect(localStorage.getItem('pactor.locale')).toBeNull();
  });
});

describe('setLocale 无刷新切换（设计 D2/D6，i18n spec）', () => {
  /** 业务文案 + 内置组件空状态（Table）混合页面 */
  function i18nPage(): PageDsl {
    return {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Page',
        children: [
          { type: 'Text', props: { value: "${t('welcome')}" } },
          {
            type: 'Table',
            props: {
              columns: [{ key: 'name', title: '名称' }],
              dataSource: [],
            },
          },
        ],
      },
    };
  }

  function createAppWith(page: PageDsl, overrides: {
    bootstrap?: Record<string, unknown>;
    locale?: string;
    messages?: I18nMessages;
    localeStorage?: LocaleStorage | false;
  } = {}): PactorApplication {
    return createPactorApplication({
      appId: 'risk-admin',
      loader: new StaticDslLoader({
        bootstrap: createBootstrap({
          menus: [standardMenus[0]],
          ...overrides.bootstrap,
        }),
        pages: { home: page },
      }),
      components: {
        Text: ({ value }: { value?: string }) => <span>{value}</span>,
      },
      locale: overrides.locale,
      messages: overrides.messages,
      localeStorage: overrides.localeStorage,
    });
  }

  /**
   * 挂载后替换 window.location（jsdom 的 location 为 [Replaceable] 可重定义，
   * 但其 reload 属性不可配置）：spy reload 以断言无整页刷新。
   * 须在 mount 之后调用（react-router 创建 history 后不再读 location 属性）。
   */
  function spyReloadAfterMount(): ReturnType<typeof vi.fn> {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload },
      configurable: true,
      writable: true,
    });
    return reload;
  }

  it('setLocale 不触发整页刷新，页面表达式按新语言求值', async () => {
    setUrl('/');
    const instance = createAppWith(i18nPage(), {
      bootstrap: { locale: 'zh-CN', messages: localeMessages },
    });
    app = instance;
    await mountApp(instance);
    await screen.findByText('欢迎');
    expect(screen.getByText('暂无数据')).toBeTruthy();

    const reload = spyReloadAfterMount();
    await act(async () => {
      instance.setLocale('en-US');
    });

    await screen.findByText('Welcome');
    expect(screen.getByText('No data')).toBeTruthy();
    expect(reload).not.toHaveBeenCalled();
    // 语言偏好已持久化
    expect(localStorage.getItem('pactor.locale')).toBe('en-US');
  });

  it('跨语言切换未补充 messages：内置组件立即切换、业务文案保留旧语言经回退链展示', async () => {
    setUrl('/');
    const instance = createAppWith(i18nPage(), {
      bootstrap: {
        locale: 'zh-CN',
        // 业务 messages 仅有中文
        messages: { 'zh-CN': { welcome: '欢迎' } },
      },
    });
    app = instance;
    await mountApp(instance);
    await screen.findByText('欢迎');

    await act(async () => {
      instance.setLocale('en-US');
    });

    // 内置组件默认文案切英文，业务文案回退 defaultLocale 继续显示中文（不显示原始 key）
    await screen.findByText('No data');
    expect(screen.getByText('欢迎')).toBeTruthy();
    expect(screen.queryByText('welcome')).toBeNull();
  });

  it('同语言补充 messages：先切换（回退旧文案），异步补齐后按新文案求值', async () => {
    setUrl('/');
    const instance = createAppWith(i18nPage(), {
      bootstrap: {
        locale: 'zh-CN',
        messages: { 'zh-CN': { welcome: '欢迎' } },
      },
    });
    app = instance;
    await mountApp(instance);
    await screen.findByText('欢迎');

    // 第一次：仅切语言，无新文案 → 回退 defaultLocale 中文
    await act(async () => {
      instance.setLocale('fr-FR');
    });
    await screen.findByText('欢迎');

    // 第二次：同语言补充 messages → 表达式按新文案求值
    await act(async () => {
      instance.setLocale('fr-FR', { welcome: 'Bienvenue' });
    });
    await screen.findByText('Bienvenue');
  });

  it('bootstrap 前调用 setLocale 暂存并于就绪后生效（并持久化）', async () => {
    setUrl('/');
    app = createAppWith(welcomePage(), {
      bootstrap: { messages: localeMessages },
    });
    // mount 前调用（bootstrap 尚未加载，session 未就绪）
    app.setLocale('fr-FR');
    await mountApp(app);

    await screen.findByText('Bienvenue');
    expect(localStorage.getItem('pactor.locale')).toBe('fr-FR');
  });

  it('localeStorage: false 时不写存储', async () => {
    setUrl('/');
    const instance = createAppWith(welcomePage(), {
      localeStorage: false,
      bootstrap: { locale: 'zh-CN', messages: localeMessages },
    });
    app = instance;
    await mountApp(instance);
    await screen.findByText('欢迎');

    await act(async () => {
      instance.setLocale('en-US');
    });
    await screen.findByText('Welcome');
    expect(localStorage.getItem('pactor.locale')).toBeNull();
  });

  it('切换后重建应用（刷新）从持久化语言启动', async () => {
    setUrl('/');
    const instance = createAppWith(welcomePage(), {
      bootstrap: { locale: 'zh-CN', messages: localeMessages },
    });
    app = instance;
    await mountApp(instance);
    await screen.findByText('欢迎');

    await act(async () => {
      instance.setLocale('en-US');
    });
    await screen.findByText('Welcome');

    // 模拟刷新：卸载后以相同 options（无 options.locale）重建应用
    await unmountApp(instance);
    app = null;
    document.body.innerHTML = '';
    app = createAppWith(welcomePage(), {
      bootstrap: { messages: localeMessages },
    });
    await mountApp(app);
    await screen.findByText('Welcome');
  });

  it('切换后布局与菜单保留（DOM 实例未卸载）', async () => {
    setUrl('/');
    const instance = createAppWith(welcomePage(), {
      bootstrap: { locale: 'zh-CN', messages: localeMessages },
    });
    app = instance;
    const target = await mountApp(instance);
    await screen.findByText('欢迎');

    const layoutEl = target.querySelector('[data-slot=admin-layout]');
    const menuItems = target.querySelectorAll('[data-slot=menu-item]');
    expect(layoutEl).not.toBeNull();
    expect(menuItems).toHaveLength(1);

    await act(async () => {
      instance.setLocale('en-US');
    });
    await screen.findByText('Welcome');

    // 布局与菜单 DOM 节点引用不变（未卸载重建）
    expect(target.querySelector('[data-slot=admin-layout]')).toBe(layoutEl);
    expect(target.querySelectorAll('[data-slot=menu-item]')).toHaveLength(1);
    expect(target.querySelectorAll('[data-slot=menu-item]')[0]).toBe(
      menuItems[0],
    );
  });
});
