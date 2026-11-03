// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const item = {
  icon: 'package',
  title: '用户管理',
  subtitle: 'v0.1.0',
  tags: [{ text: '已安装', color: 'success' }],
  description: '管理插件安装状态与运行生命周期，支持启停与依赖检查。',
  meta: '平台组 · 更新于 2026-09-28',
  actions: [
    { text: '配置', variant: 'link' },
    { text: '停用' },
  ],
};

describe('EntityCard 业务组件', () => {
  it('三层结构：图标+标题+副文案 / 标签 / 描述+meta / 浅底栏按钮组', () => {
    const { container } = renderDsl({ type: 'EntityCard', props: item });

    expect(container.querySelector('[data-slot=entity-card]')).not.toBeNull();
    expect(screen.getByText('用户管理')).toBeTruthy();
    expect(screen.getByText('v0.1.0')).toBeTruthy();
    expect(screen.getByText('已安装')).toBeTruthy();
    expect(screen.getByText(item.description)).toBeTruthy();
    expect(screen.getByText('平台组 · 更新于 2026-09-28')).toBeTruthy();
    const footer = container.querySelector('[data-slot=entity-card-footer]');
    expect(footer).not.toBeNull();
    expect(footer!.className).toContain('bg-muted');
    expect(screen.getByRole('button', { name: '配置' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '停用' })).toBeTruthy();
  });

  it('footerBackground=false 下层不带浅底栏背景', () => {
    const { container } = renderDsl({
      type: 'EntityCard',
      props: { ...item, footerBackground: false },
    });
    expect(container.querySelector('[data-slot=entity-card-footer]')!.className).not.toContain(
      'bg-muted',
    );
  });

  it('无 actions 不渲染下层；logo 优先于 icon', () => {
    const { container } = renderDsl({
      type: 'EntityCard',
      props: { logo: '/logo.png', title: '文件存储' },
    });
    expect(container.querySelector('[data-slot=entity-card-footer]')).toBeNull();
    expect(container.querySelector('img[src="/logo.png"]')).not.toBeNull();
  });

  it('onAction 事件参数 { key, text, index }；按钮点击不触发整卡 onClick', async () => {
    const { context } = renderDsl({
      type: 'EntityCard',
      props: { ...item, hoverable: true },
      events: {
        onClick: { action: 'setState', params: { clicked: true } },
        onAction: { action: 'setState', params: { lastAction: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '停用' }));
    await expectEventState(context, 'lastAction', { key: '停用', text: '停用', index: 1 });
    expect(context.state.get('clicked')).toBeUndefined();

    fireEvent.click(screen.getByText('用户管理'));
    await expectEventState(context, 'clicked', true);
  });

  it('expandingActions 渲染展开式图标操作组；无 actions 时也渲染下层', () => {
    const { container } = renderDsl({
      type: 'EntityCard',
      props: {
        icon: 'database',
        title: '订单生产库',
        expandingActions: [
          { value: 'edit', label: '编辑', icon: 'search' },
          { value: 'delete', label: '删除', icon: 'zap', confirm: true },
        ],
      },
    });

    expect(container.querySelector('[data-slot=entity-card-footer]')).not.toBeNull();
    expect(container.querySelector('[data-slot=expanding-button-group]')).not.toBeNull();
    expect(screen.getByRole('button', { name: '编辑' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '删除' })).toBeTruthy();
  });

  it('expandingActions 与 actions 并存互不影响；onExpandingAction 回传 value，confirm 选项二次点击才触发且不触发整卡 onClick', async () => {
    const { container, context } = renderDsl({
      type: 'EntityCard',
      props: {
        ...item,
        hoverable: true,
        expandingActions: [
          { value: 'edit', label: '编辑', icon: 'search' },
          { value: 'delete', label: '删除', icon: 'zap', confirm: true },
        ],
      },
      events: {
        onClick: { action: 'setState', params: { clicked: true } },
        onExpandingAction: { action: 'setState', params: { picked: '${event}' } },
      },
    });

    // actions 原样渲染
    expect(screen.getByRole('button', { name: '配置' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '停用' })).toBeTruthy();

    // 普通选项单击即触发
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));
    await expectEventState(context, 'picked', 'edit');
    expect(context.state.get('clicked')).toBeUndefined();

    // confirm 选项：首次点击进入确认态，再次点击才触发
    const del = screen.getByRole('button', { name: '删除' });
    fireEvent.click(del);
    expect(context.state.get('picked')).toBe('edit');
    expect(container.querySelector('[data-confirming]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '确认' }));
    await expectEventState(context, 'picked', 'delete');
    expect(context.state.get('clicked')).toBeUndefined();
  });
});

describe('EntityCardList 业务组件', () => {
  const items = [
    { ...item, id: 1 },
    { ...item, id: 2, title: '数据同步', tags: [{ text: '未安装' }] },
  ];

  it('网格渲染数据卡 + 计数；columns/gap 生效', () => {
    const { container } = renderDsl({
      type: 'EntityCardList',
      props: { items, columns: 2, gap: 8, showCount: true },
    });
    const grid = container.querySelector('[data-slot=entity-card-list-grid]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(grid.style.gap).toBe('8px');
    expect(container.querySelectorAll('[data-slot=entity-card]').length).toBe(2);
    expect(screen.getByText('共 2 个')).toBeTruthy();
  });

  it('createText 渲染首格虚线新建占位卡并触发 onCreateClick', async () => {
    const { container, context } = renderDsl({
      type: 'EntityCardList',
      props: { items, createText: '新建插件' },
      events: {
        onCreateClick: { action: 'setState', params: { create: true } },
      },
    });
    const grid = container.querySelector('[data-slot=entity-card-list-grid]')!;
    const createCard = grid.firstElementChild as HTMLElement;
    expect(createCard.className).toContain('border-dashed');
    fireEvent.click(screen.getByText('新建插件'));
    await expectEventState(context, 'create', true);
  });

  it('空数据展示 Empty', () => {
    renderDsl({ type: 'EntityCardList', props: { items: [] } });
    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  it('onItemClick / onItemAction 事件参数携带 item 与 index', async () => {
    const { context } = renderDsl({
      type: 'EntityCardList',
      props: { items, hoverable: true },
      events: {
        onItemClick: { action: 'setState', params: { picked: '${event}' } },
        onItemAction: { action: 'setState', params: { acted: '${event}' } },
      },
    });

    fireEvent.click(screen.getAllByRole('button', { name: '停用' })[1]!);
    await expectEventState(context, 'acted', {
      key: '停用',
      text: '停用',
      item: items[1],
      index: 1,
    });

    fireEvent.click(screen.getByText('数据同步'));
    await expectEventState(context, 'picked', { item: items[1], index: 1 });
  });

  it('item.expandingActions 透传 EntityCard；onItemExpandingAction 参数 { value, item, index }', async () => {
    const expandingItems = [
      {
        title: '订单生产库',
        expandingActions: [
          { value: 'edit', label: '编辑', icon: 'square-pen' },
          { value: 'toggle', label: '停用', icon: 'square' },
        ],
      },
    ];
    const { container, context } = renderDsl({
      type: 'EntityCardList',
      props: { items: expandingItems },
      events: {
        onItemExpandingAction: { action: 'setState', params: { acted: '${event}' } },
      },
    });

    expect(container.querySelector('[data-slot=expanding-button-group]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '停用' }));
    await expectEventState(context, 'acted', {
      value: 'toggle',
      item: expandingItems[0],
      index: 0,
    });
  });
});
