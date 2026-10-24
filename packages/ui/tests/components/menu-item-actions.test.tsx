// @vitest-environment jsdom
/**
 * Menu 项级操作契约：trailing 弱提示文本、actions 图标按钮 / 下拉触发器，
 * onItemAction 事件载荷（{ key, action }，下拉选择为 `按钮key:项value`），
 * 操作点击不触发 onSelect / 目录 toggle。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDsl } from './helpers.js';

const ITEMS = [
  {
    key: 'inst-1',
    label: '实例一',
    actions: [
      { key: 'add', icon: 'plus', tooltip: '添加' },
      {
        key: 'more',
        icon: 'ellipsis',
        tooltip: '更多',
        menu: [
          { label: '重命名', value: 'rename' },
          { label: '删除', value: 'delete', danger: true },
        ],
      },
    ],
    children: [
      {
        key: 'inst-1/conv-1',
        label: '会话一',
        icon: 'message-square',
        trailing: '10:30',
        actions: [
          {
            key: 'more',
            icon: 'ellipsis',
            menu: [
              { label: '重命名', value: 'rename' },
              { label: '删除', value: 'delete', danger: true },
            ],
          },
        ],
      },
    ],
  },
];

function renderMenu() {
  return renderDsl({
    type: 'Menu',
    props: { items: ITEMS },
    events: {
      onSelect: { action: 'setState', params: { selected: '${event}' } },
      onItemAction: {
        action: 'setState',
        params: { actionKey: '${event.key}', actionName: '${event.action}' },
      },
    },
  });
}

describe('Menu 项级操作', () => {
  it('组项右端渲染添加 / 更多按钮，子项右端渲染 trailing 时间与更多按钮', () => {
    const { container } = renderMenu();

    const group = container.querySelector('[data-slot=menu-entry][data-key="inst-1"]');
    const groupActions = group!.querySelectorAll(':scope [data-slot=menu-item-action]');
    // 组项两个操作 + 子项一个操作
    expect(groupActions.length).toBe(3);
    expect(screen.getByText('10:30').getAttribute('data-slot')).toBe(
      'menu-item-trailing',
    );
  });

  it('点击添加图标：onItemAction 传出 { key, action: add }，不触发 onSelect', () => {
    const { container, context } = renderMenu();

    const group = container.querySelector('[data-slot=menu-entry][data-key="inst-1"]');
    const add = group!.querySelector('[data-action="add"]')!;
    fireEvent.click(add);

    expect(context.state.get('actionKey')).toBe('inst-1');
    expect(context.state.get('actionName')).toBe('add');
    expect(context.state.get('selected')).toBeUndefined();
  });

  it('点击更多按钮展开下拉框，选择删除传出 more:delete', () => {
    const { container, context } = renderMenu();

    const group = container.querySelector('[data-slot=menu-entry][data-key="inst-1"]');
    const more = group!.querySelector('[data-action="more"]')!;
    fireEvent.click(more);

    const del = screen.getByText('删除');
    fireEvent.click(del);

    expect(context.state.get('actionKey')).toBe('inst-1');
    expect(context.state.get('actionName')).toBe('more:delete');
    expect(context.state.get('selected')).toBeUndefined();
  });

  it('collapsed（icon rail）下不渲染 trailing 与操作按钮', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: { items: ITEMS, collapsed: true },
    });
    expect(container.querySelector('[data-slot=menu-item-action]')).toBeNull();
    expect(container.querySelector('[data-slot=menu-item-trailing]')).toBeNull();
  });

  it('目录项不可选中：点击组不触发 onSelect、无选中态（未开 collapsible 时静态展开）', () => {
    const { container, context } = renderMenu();

    const group = container.querySelector('[data-slot=menu-entry][data-key="inst-1"]');
    const button = group!.querySelector('[data-slot=menu-item]')!;
    fireEvent.click(button);

    expect(context.state.get('selected')).toBeUndefined();
    expect(button.getAttribute('aria-current')).toBeNull();
    // 未开 collapsible：子菜单静态展开，点击为空操作
    expect(
      container.querySelector('[data-slot=menu-entry][data-key="inst-1/conv-1"]'),
    ).not.toBeNull();
  });

  it('collapsible 下目录点击只折叠/展开；defaultExpandAll 初始展开', () => {
    const { container, context } = renderDsl({
      type: 'Menu',
      props: { items: ITEMS, collapsible: true, defaultExpandAll: true },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });
    const child = '[data-slot=menu-entry][data-key="inst-1/conv-1"]';
    // defaultExpandAll：初始展开
    expect(container.querySelector(child)).not.toBeNull();

    const group = container.querySelector('[data-slot=menu-entry][data-key="inst-1"]');
    const button = group!.querySelector('[data-slot=menu-item]')!;
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);
    expect(container.querySelector(child)).toBeNull();
    expect(context.state.get('selected')).toBeUndefined();

    fireEvent.click(button);
    expect(container.querySelector(child)).not.toBeNull();
  });

  it('行容器形态：悬浮/选中底色在 menu-item-row 上，按钮本体透明无圆角', () => {
    const { container } = renderMenu();

    const row = container.querySelector('[data-slot=menu-item-row]')!;
    expect(row.className).toContain('rounded-md');
    expect(row.className).toContain('hover:bg-(--menu-hover-background)/50');
    const button = row.querySelector('[data-slot=menu-item]')!;
    expect(button.className).not.toContain('rounded-md');
  });

  it('chevronPlacement：缺省在行内右端，left 时渲染在图标/文字前', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: { items: ITEMS, collapsible: true },
    });
    const button = container.querySelector(
      '[data-slot=menu-entry][data-key="inst-1"] [data-slot=menu-item]',
    )!;
    // 缺省 right：chevron 为按钮末尾
    expect(button.lastElementChild?.getAttribute('data-slot')).toBe(
      'menu-item-chevron',
    );
  });

  it('chevronPlacement: left 时 chevron 为按钮首个子元素', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: { items: ITEMS, collapsible: true, chevronPlacement: 'left' },
    });
    const button = container.querySelector(
      '[data-slot=menu-entry][data-key="inst-1"] [data-slot=menu-item]',
    )!;
    expect(button.firstElementChild?.getAttribute('data-slot')).toBe(
      'menu-item-chevron',
    );
  });

  it('子菜单缩进由左侧竖线容器承载：子项 padding 归零、wrapper 带 border-l', () => {
    const getPadding = (
      container: HTMLElement,
      key: string,
    ): string =>
      (
        container.querySelector(
          `[data-slot=menu-entry][data-key="${key}"] [data-slot=menu-item]`,
        )! as HTMLElement
      ).style.paddingLeft;

    const left = renderDsl({
      type: 'Menu',
      props: {
        items: ITEMS,
        collapsible: true,
        defaultExpandAll: true,
        chevronPlacement: 'left',
      },
    });
    expect(getPadding(left.container, 'inst-1')).toBe('');
    // 目录项（带子菜单的父菜单）文字加粗
    expect(
      left.container
        .querySelector(
          '[data-slot=menu-entry][data-key="inst-1"] [data-slot=menu-item] span.truncate',
        )!
        .className,
    ).toContain('font-semibold');
    // 缩进由 menu-children 容器（ml-5 对准父项图标中心 + pl-4）承担，
    // 子项自身 padding 归零（内联样式不写）
    expect(getPadding(left.container, 'inst-1/conv-1')).toBe('');
    const leftLine = left.container.querySelector(
      '[data-slot=menu-entry][data-key="inst-1"] [data-slot=menu-children]',
    )!;
    expect(leftLine).not.toBeNull();
    expect(leftLine.className).toContain('border-l');
    expect(leftLine.className).toContain('ml-5');
    // 条目与竖线间距 4px 由容器 pl-1 承担
    expect(leftLine.className).toContain('pl-1');
    // 父项名称与首个条目之间 2px 间距由容器 pt-0.5 承担
    expect(leftLine.className).toContain('pt-0.5');
    // 子项与竖线间距 4px（pl-1），hover 右移（hover:pl-2）
    const childBtn = left.container.querySelector(
      '[data-slot=menu-entry][data-key="inst-1/conv-1"] [data-slot=menu-item]',
    )!;
    expect(childBtn.className).toContain('pl-1');
    expect(childBtn.className).toContain('hover:pl-2');
    // 图标弱化一档（SVG className 在 jsdom 不可靠，用 attribute）
    expect(
      childBtn.querySelector('[data-slot=icon]')!.getAttribute('class'),
    ).toContain('text-muted-foreground');

    const right = renderDsl({
      type: 'Menu',
      props: { items: ITEMS, collapsible: true, defaultExpandAll: true },
    });
    expect(getPadding(right.container, 'inst-1/conv-1')).toBe('');
    // 目录内子项之间纵向间距（对齐一级菜单 gap-0.5）
    expect(
      right.container
        .querySelector('[data-slot=menu-entry][data-key="inst-1"] [data-slot=menu-children]')!
        .className,
    ).toContain('gap-0.5');

    // 选中态保留 hover 同款右移（pl-2）
    const selected = renderDsl({
      type: 'Menu',
      props: {
        items: ITEMS,
        collapsible: true,
        defaultExpandAll: true,
        selectedKey: 'inst-1/conv-1',
      },
    });
    expect(
      selected.container
        .querySelector(
          '[data-slot=menu-entry][data-key="inst-1/conv-1"] [data-slot=menu-item]',
        )!
        .className,
    ).toContain('pl-2');
  });

  it('空组（children: []）同样是目录：不可选中、无 chevron、不触发 onSelect', () => {
    const { container, context } = renderDsl({
      type: 'Menu',
      props: {
        items: [{ key: 'empty-inst', label: '空实例', children: [] }],
        collapsible: true,
        selectedKey: 'empty-inst',
      },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });
    const button = container.querySelector(
      '[data-slot=menu-entry][data-key="empty-inst"] [data-slot=menu-item]',
    )!;
    // 无选中态、无 chevron
    expect(button.getAttribute('aria-current')).toBeNull();
    expect(
      button.querySelector('[data-slot=menu-item-chevron]'),
    ).toBeNull();
    fireEvent.click(button);
    expect(context.state.get('selected')).toBeUndefined();
  });
});
