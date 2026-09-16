// @vitest-environment jsdom
/**
 * Header 结构区域契约（spec: layout-components / extend-header-component）：
 * 品牌区 / 通用下拉 / 横向菜单 / 用户区 / 国际化切换五个可选区域的渲染、
 * 事件值规范化（${event} 载荷）与区域排布；全部区域缺省时退化为纯容器。
 */
import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  I18nContextProvider,
  registerBuiltinActions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  expectIconBeforeLabel,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

/**
 * 以指定 locale 渲染 DSL（最小注入：I18nContextProvider 包裹
 * DslRenderer，不改 runtime）；缺省 locale 场景直接用 renderDsl
 */
function renderDslWithLocale(
  node: DslNode,
  locale: string,
): RenderResult & { context: RuntimeContext } {
  const context = createRuntimeContext({
    locale,
    components: createComponentRegistry(),
  });
  registerBuiltinActions(context.actions);
  const result = render(
    <I18nContextProvider value={context.i18n}>
      <DslRenderer context={context} node={node} />
    </I18nContextProvider>,
  );
  return { context, ...result };
}

/** 断言元素的 data-slot 序列（区域排布契约） */
function expectSlotOrder(parent: Element, slots: string[]) {
  expect(
    Array.from(parent.children).map((el) => el.getAttribute('data-slot')),
  ).toEqual(slots);
}

describe('Header 纯容器回归', () => {
  it('缺省全部区域 props 时渲染为仅含 children 的顶部容器', () => {
    const { container } = renderDsl({
      type: 'Header',
      children: [{ type: 'Text', props: { text: '标题内容' } }],
    });

    const header = container.querySelector('[data-slot=layout-header]')!;
    expect(header).not.toBeNull();
    // 无区域包装节点：children 直接挂载（与变更前结构一致）
    expect(container.querySelector('[data-slot=header-left]')).toBeNull();
    expect(container.querySelector('[data-slot=header-center]')).toBeNull();
    expect(container.querySelector('[data-slot=header-right]')).toBeNull();
    expect(header.firstElementChild!.textContent).toBe('标题内容');
  });

  it('通用 props 作用于根节点（结构区域存在时挂载点不变）', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: { title: '控制台', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=layout-header]'));
  });
});

describe('Header 品牌区', () => {
  it('仅标题：左侧渲染标题文本，无 logo 图片', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: { title: '控制台' },
    });

    const left = container.querySelector('[data-slot=header-left]')!;
    expect(left).not.toBeNull();
    expect(screen.getByText('控制台').getAttribute('data-slot')).toBe(
      'header-brand-title',
    );
    expect(container.querySelector('[data-slot=header-brand-logo]')).toBeNull();
  });

  it('logo + 标题靠右：品牌区在右侧，logo 在标题之前', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: { logo: '/logo.svg', title: '控制台', brandPosition: 'right' },
    });

    const right = container.querySelector('[data-slot=header-right]')!;
    expect(right.querySelector('[data-slot=header-brand]')).not.toBeNull();
    expect(container.querySelector('[data-slot=header-left]')).toBeNull();
    expectSlotOrder(right.querySelector('[data-slot=header-brand]')!, [
      'header-brand-logo',
      'header-brand-title',
    ]);
    const logo = right.querySelector('[data-slot=header-brand-logo]')!;
    expect(logo.tagName).toBe('IMG');
    expect(logo.getAttribute('src')).toBe('/logo.svg');
  });
});

describe('Header 通用下拉', () => {
  it('靠左渲染；选中项 onDropdownSelect 传出 value', async () => {
    const { context } = renderDsl({
      type: 'Header',
      props: {
        dropdown: {
          label: '切换团队',
          items: [{ label: '团队A', value: 'a' }],
        },
      },
      events: {
        onDropdownSelect: { action: 'setState', params: { team: '${event}' } },
      },
    });

    const trigger = screen.getByText('切换团队');
    expect(trigger.closest('[data-slot=header-left]')).not.toBeNull();
    expect(trigger.getAttribute('data-slot')).toBe('header-dropdown');

    fireEvent.click(trigger);
    fireEvent.click(await screen.findByText('团队A'));
    await expectEventState(context, 'team', 'a');
  });

  it('position right：渲染于头部右侧区域', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: {
        dropdown: {
          label: '切换团队',
          position: 'right',
          items: [{ label: '团队A', value: 'a' }],
        },
      },
    });

    const right = container.querySelector('[data-slot=header-right]')!;
    expect(right.querySelector('[data-slot=header-dropdown]')).not.toBeNull();
    expect(container.querySelector('[data-slot=header-left]')).toBeNull();
  });
});

describe('Header 横向菜单', () => {
  it('菜单项横向排列；点击 onMenuSelect 传出 key', async () => {
    const { container, context } = renderDsl({
      type: 'Header',
      props: {
        menu: [
          { key: 'home', label: '首页' },
          { key: 'list', label: '列表' },
        ],
      },
      events: {
        onMenuSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    const menu = container.querySelector('[data-slot=header-menu]')!;
    expect(menu.classList.contains('flex')).toBe(true);
    expect(menu.closest('[data-slot=header-left]')).not.toBeNull();

    fireEvent.click(screen.getByText('列表'));
    await expectEventState(context, 'selected', 'list');
  });

  it('嵌套 children 子菜单：选中叶子项传出其 key', async () => {
    const { context } = renderDsl({
      type: 'Header',
      props: {
        menu: [
          { key: 'home', label: '首页' },
          {
            key: 'mgmt',
            label: '管理',
            children: [{ key: 'user-list', label: '用户列表' }],
          },
        ],
      },
      events: {
        onMenuSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    fireEvent.click(screen.getByText('管理'));
    fireEvent.click(await screen.findByText('用户列表'));
    await expectEventState(context, 'selected', 'user-list');
  });

  it('菜单项声明 icon：叶子项与子菜单项均在文字前渲染图标', async () => {
    const { container } = renderDsl({
      type: 'Header',
      props: {
        menu: [
          { key: 'home', label: '首页', icon: 'home' },
          {
            key: 'mgmt',
            label: '管理',
            children: [{ key: 'user-list', label: '用户列表', icon: 'users' }],
          },
        ],
      },
    });

    expectIconBeforeLabel(
      container.querySelector('[data-slot=header-menu-item][data-key=home]')!,
      '首页',
    );

    fireEvent.click(screen.getByText('管理'));
    const child = await screen.findByText('用户列表');
    expectIconBeforeLabel(child, '用户列表');
  });
});

describe('Header 用户区', () => {
  it('items 非空：选中菜单项 onUserSelect 传出 value', async () => {
    const { container, context } = renderDsl({
      type: 'Header',
      props: {
        user: {
          name: '张三',
          items: [{ label: '退出登录', value: 'logout' }],
        },
      },
      events: {
        onUserSelect: { action: 'setState', params: { op: '${event}' } },
      },
    });

    const userArea = container.querySelector('[data-slot=header-user]')!;
    expect(userArea.closest('[data-slot=header-right]')).not.toBeNull();
    // 头像缺省时以用户名首字符占位
    expect(userArea.textContent).toContain('张');

    fireEvent.click(screen.getByText('张三'));
    fireEvent.click(await screen.findByText('退出登录'));
    await expectEventState(context, 'op', 'logout');
  });

  it('items 缺省：纯展示（头像占位 + 用户名），无可点击下拉', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: { user: { name: '张三' } },
    });

    const userArea = container.querySelector('[data-slot=header-user]')!;
    expect(userArea.tagName).toBe('DIV');
    expect(userArea.textContent).toContain('张');
    expect(userArea.textContent).toContain('张三');
    expect(container.querySelector('[data-slot=dropdown-menu-trigger]')).toBeNull();
  });
});

describe('Header 国际化切换', () => {
  const locales = [
    { label: '中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
  ];

  it('触发器显示当前 locale 对应 label；选中 onLocaleChange 传出 locale 值', async () => {
    const { context } = renderDslWithLocale(
      {
        type: 'Header',
        props: { locales },
        events: {
          onLocaleChange: {
            action: 'setState',
            params: { locale: '${event}' },
          },
        },
      },
      'zh-CN',
    );

    const trigger = screen.getByText('中文');
    expect(trigger.getAttribute('data-slot')).toBe('header-locales');

    fireEvent.click(trigger);
    fireEvent.click(await screen.findByText('English'));
    await expectEventState(context, 'locale', 'en-US');
  });

  it('当前 locale 未命中选项时触发器显示 value 本身', () => {
    renderDslWithLocale(
      { type: 'Header', props: { locales } },
      'fr-FR',
    );
    expect(screen.getByText('fr-FR').getAttribute('data-slot')).toBe(
      'header-locales',
    );
  });
});

describe('Header 深浅色切换', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-pactor-theme');
  });

  it('themeToggle 为 true 时在右侧渲染切换按钮；点击翻转 data-pactor-theme 并经 onThemeChange 传出新主题', async () => {
    const { container, context } = renderDsl({
      type: 'Header',
      props: { themeToggle: true },
      events: {
        onThemeChange: { action: 'setState', params: { theme: '${event}' } },
      },
    });

    const right = container.querySelector('[data-slot=header-right]')!;
    const toggle = right.querySelector('[data-slot=header-theme-toggle]')!;
    expect(toggle).not.toBeNull();
    // 缺省 light：显示 moon 图标
    expect(toggle.querySelector('svg.lucide-moon')).not.toBeNull();

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe(
      'dark',
    );
    await expectEventState(context, 'theme', 'dark');
    expect(toggle.querySelector('svg.lucide-sun')).not.toBeNull();

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
    await expectEventState(context, 'theme', 'light');
    expect(toggle.querySelector('svg.lucide-moon')).not.toBeNull();
  });

  it('初始为 dark（documentElement 已带属性）时显示 sun 图标，点击后移除属性', () => {
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    const { container } = renderDsl({
      type: 'Header',
      props: { themeToggle: true },
    });

    const toggle = container.querySelector('[data-slot=header-theme-toggle]')!;
    expect(toggle.querySelector('svg.lucide-sun')).not.toBeNull();

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
  });

  it('缺省（themeToggle 未声明）时不渲染切换按钮', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: { title: '控制台' },
    });
    expect(container.querySelector('[data-slot=header-theme-toggle]')).toBeNull();
  });
});

describe('Header 区域排布与 children 共存', () => {
  it('全区域组合：左侧品牌→菜单，右侧下拉→locales→用户，children 在中间弹性区', () => {
    const { container } = renderDsl({
      type: 'Header',
      props: {
        logo: '/logo.svg',
        title: '控制台',
        menu: [{ key: 'home', label: '首页' }],
        dropdown: {
          label: '切换团队',
          position: 'right',
          items: [{ label: '团队A', value: 'a' }],
        },
        locales: [{ label: '中文', value: 'zh-CN' }],
        user: { name: '张三' },
      },
      children: [{ type: 'Button', props: { text: '操作' } }],
    });

    expectSlotOrder(container.querySelector('[data-slot=header-left]')!, [
      'header-brand',
      'header-menu',
    ]);
    const center = container.querySelector('[data-slot=header-center]')!;
    expect(center.classList.contains('flex-1')).toBe(true);
    expect(center.textContent).toContain('操作');
    expectSlotOrder(container.querySelector('[data-slot=header-right]')!, [
      'header-dropdown',
      'header-locales',
      'header-user',
    ]);
  });

  it('仅声明 title 时品牌区与 children 均渲染', () => {
    renderDsl({
      type: 'Header',
      props: { title: '控制台' },
      children: [{ type: 'Button', props: { text: '新建' } }],
    });

    expect(screen.getByText('控制台')).toBeTruthy();
    expect(screen.getByRole('button', { name: '新建' })).toBeTruthy();
  });
});
