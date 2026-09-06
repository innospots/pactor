// @vitest-environment jsdom
/**
 * 扩展导航类组件契约（spec: shadcn-extended-components / 导航类组件）：
 * Breadcrumb / Pagination / Menubar / NavigationMenu / DropdownMenu /
 * ContextMenu 的 items 数据声明、事件值规范化（onSelect/onChange 语义值）
 * 与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  expectIconBeforeLabel,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Breadcrumb', () => {
  it('渲染路径：带 href 的非末项为链接，末项为当前页纯文本', () => {
    renderDsl({
      type: 'Breadcrumb',
      props: {
        items: [
          { label: '首页', href: '/' },
          { label: '列表', href: '/list' },
          { label: '详情' },
        ],
      },
    });

    const home = screen.getByText('首页');
    expect(home.tagName).toBe('A');
    expect(home.getAttribute('href')).toBe('/');

    const detail = screen.getByText('详情');
    expect(detail.getAttribute('data-slot')).toBe('breadcrumb-page');
    expect(detail.getAttribute('aria-current')).toBe('page');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Breadcrumb',
      props: { items: [{ label: '首页' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=breadcrumb]'));
  });
});

describe('Pagination', () => {
  it('total 95 / pageSize 10：点击第 3 页 onChange 传出页码 3', async () => {
    const { context } = renderDsl({
      type: 'Pagination',
      props: { total: 95, pageSize: 10, page: 1 },
      events: {
        onChange: { action: 'setState', params: { page: '${event}' } },
      },
    });

    fireEvent.click(screen.getByText('3'));
    await expectEventState(context, 'page', 3);
  });

  it('受控 page 高亮当前页；下一页按钮传出 current+1', async () => {
    const { context } = renderDsl({
      type: 'Pagination',
      props: { total: 30, pageSize: 10, page: 2 },
      events: {
        onChange: { action: 'setState', params: { page: '${event}' } },
      },
    });

    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
    fireEvent.click(screen.getByLabelText('Go to next page'));
    await expectEventState(context, 'page', 3);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Pagination',
      props: { total: 10, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=pagination]'));
  });
});

describe('Menubar', () => {
  it('menus 嵌套渲染，选中叶子项 onSelect 传出 value', async () => {
    const { context } = renderDsl({
      type: 'Menubar',
      props: {
        menus: [
          {
            label: '文件',
            items: [
              { label: '新建', value: 'create' },
              { label: '删除', value: 'delete', disabled: true },
            ],
          },
        ],
      },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    fireEvent.click(screen.getByText('文件'));
    const item = await screen.findByText('新建');
    fireEvent.click(item);
    await expectEventState(context, 'selected', 'create');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Menubar',
      props: { menus: [], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=menubar]'));
  });

  it('叶子项声明 icon 时在文字前渲染图标', async () => {
    renderDsl({
      type: 'Menubar',
      props: {
        menus: [
          { label: '文件', items: [{ label: '新建', value: 'create', icon: 'plus' }] },
        ],
      },
    });

    fireEvent.click(screen.getByText('文件'));
    const item = await screen.findByText('新建');
    expectIconBeforeLabel(item, '新建');
  });
});

describe('NavigationMenu', () => {
  it('href 项渲染直链；children 项渲染触发器与面板链接', async () => {
    renderDsl({
      type: 'NavigationMenu',
      props: {
        items: [
          { label: '概览', href: '/' },
          {
            label: '产品',
            children: [
              { label: '分析', href: '/analytics', description: '数据洞察' },
            ],
          },
        ],
      },
    });

    const overview = screen.getByText('概览');
    expect(overview.tagName).toBe('A');
    expect(overview.getAttribute('href')).toBe('/');

    // 含 children 的项：触发器展开后渲染子链接与 description
    fireEvent.click(screen.getByText('产品'));
    expect(await screen.findByText('分析')).toBeTruthy();
    expect(screen.getByText('数据洞察')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'NavigationMenu',
      props: { items: [], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=navigation-menu]'));
  });

  it('顶级项与子链接声明 icon 时在文字前渲染图标', async () => {
    renderDsl({
      type: 'NavigationMenu',
      props: {
        items: [
          { label: '概览', href: '/', icon: 'home' },
          {
            label: '产品',
            children: [{ label: '分析', href: '/analytics', icon: 'chart' }],
          },
        ],
      },
    });

    expectIconBeforeLabel(screen.getByText('概览'), '概览');

    fireEvent.click(screen.getByText('产品'));
    const child = await screen.findByText('分析');
    expectIconBeforeLabel(child.closest('a')!, '分析');
  });
});

describe('DropdownMenu', () => {
  it('点击触发元素后选择菜单项，onSelect 传出 value', async () => {
    const { context } = renderDsl({
      type: 'DropdownMenu',
      props: {
        items: [
          { label: '编辑', value: 'edit' },
          { label: '删除', value: 'delete', danger: true },
        ],
      },
      events: {
        onSelect: { action: 'setState', params: { op: '${event}' } },
      },
      children: [{ type: 'Button', props: { text: '操作' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=dropdown-menu-trigger-wrap]') as HTMLElement);
    const item = await screen.findByText('编辑');
    fireEvent.click(item);
    await expectEventState(context, 'op', 'edit');
  });

  it('danger 项渲染 destructive 语义', async () => {
    renderDsl({
      type: 'DropdownMenu',
      props: { items: [{ label: '删除', value: 'delete', danger: true }] },
      children: [{ type: 'Button', props: { text: '操作' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=dropdown-menu-trigger-wrap]') as HTMLElement);
    const item = await screen.findByText('删除');
    expect(item.getAttribute('data-variant')).toBe('destructive');
  });

  it('通用 props 作用于浮层内容根节点', async () => {
    renderDsl({
      type: 'DropdownMenu',
      props: { items: [{ label: '编辑', value: 'edit' }], ...COMMON_PROPS },
      children: [{ type: 'Button', props: { text: '操作' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=dropdown-menu-trigger-wrap]') as HTMLElement);
    await screen.findByText('编辑');
    expectCommonProps(document.querySelector('[data-slot=dropdown-menu-content]'));
  });

  it('菜单项声明 icon 时在文字前渲染图标', async () => {
    renderDsl({
      type: 'DropdownMenu',
      props: { items: [{ label: '编辑', value: 'edit', icon: 'pencil' }] },
      children: [{ type: 'Button', props: { text: '操作' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=dropdown-menu-trigger-wrap]') as HTMLElement);
    const item = await screen.findByText('编辑');
    expectIconBeforeLabel(item, '编辑');
  });
});

describe('ContextMenu', () => {
  it('右键区域弹出菜单，选中项 onSelect 传出 value', async () => {
    const { container, context } = renderDsl({
      type: 'ContextMenu',
      props: {
        items: [
          { label: '重命名', value: 'rename' },
          { label: '删除', value: 'delete', danger: true },
        ],
      },
      events: {
        onSelect: { action: 'setState', params: { op: '${event}' } },
      },
      children: [{ type: 'Text', props: { text: '文件.txt' } }],
    });

    const area = container.querySelector('[data-slot=context-menu-trigger]')!;
    fireEvent.contextMenu(area);
    const item = await screen.findByText('重命名');
    fireEvent.click(item);
    await expectEventState(context, 'op', 'rename');
  });

  it('通用 props 作用于浮层内容根节点', async () => {
    const { container } = renderDsl({
      type: 'ContextMenu',
      props: { items: [{ label: '重命名', value: 'rename' }], ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: '文件.txt' } }],
    });

    fireEvent.contextMenu(container.querySelector('[data-slot=context-menu-trigger]')!);
    await screen.findByText('重命名');
    expectCommonProps(document.querySelector('[data-slot=context-menu-content]'));
  });

  it('菜单项声明 icon 时在文字前渲染图标', async () => {
    const { container } = renderDsl({
      type: 'ContextMenu',
      props: { items: [{ label: '重命名', value: 'rename', icon: 'edit' }] },
      children: [{ type: 'Text', props: { text: '文件.txt' } }],
    });

    fireEvent.contextMenu(container.querySelector('[data-slot=context-menu-trigger]')!);
    const item = await screen.findByText('重命名');
    expectIconBeforeLabel(item, '重命名');
  });
});
