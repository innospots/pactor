// @vitest-environment jsdom
/**
 * 扩展反馈与弹层类组件契约（spec: shadcn-extended-components /
 * 反馈与弹层类组件）：Accordion / Collapsible / Tooltip / HoverCard /
 * Dialog / AlertDialog / Drawer / Sheet / Popover / Sonner 的
 * DSL 子树渲染、受控 open、确认链路与通用 props。
 */
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Accordion', () => {
  it('items 渲染标题；展开 pane 时渲染 children DSL 子树（含 Button）', async () => {
    renderDsl({
      type: 'Accordion',
      props: {
        items: [
          {
            key: 'a',
            title: '第一节',
            children: [{ type: 'Button', props: { text: '面板内按钮' } }],
          },
          { key: 'b', title: '第二节', children: [{ type: 'Text', props: { text: '文本' } }] },
        ],
      },
    });

    expect(screen.getByText('第一节')).toBeTruthy();
    fireEvent.click(screen.getByText('第一节'));
    expect(await screen.findByRole('button', { name: '面板内按钮' })).toBeTruthy();
  });

  it('multiple：两个面板可同时展开', async () => {
    renderDsl({
      type: 'Accordion',
      props: {
        multiple: true,
        items: [
          { key: 'a', title: '甲', children: [{ type: 'Text', props: { text: '甲内容' } }] },
          { key: 'b', title: '乙', children: [{ type: 'Text', props: { text: '乙内容' } }] },
        ],
      },
    });

    fireEvent.click(screen.getByText('甲'));
    fireEvent.click(screen.getByText('乙'));
    await vi.waitFor(() => {
      expect(screen.getByText('甲内容')).toBeTruthy();
      expect(screen.getByText('乙内容')).toBeTruthy();
    });
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Accordion',
      props: { items: [{ key: 'a', title: '甲' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=accordion]'));
  });
});

describe('Collapsible', () => {
  it('title 触发展开，children 折叠内容渲染', async () => {
    renderDsl({
      type: 'Collapsible',
      props: { title: '更多' },
      children: [{ type: 'Text', props: { text: '折叠内容' } }],
    });

    fireEvent.click(screen.getByText('更多'));
    expect(await screen.findByText('折叠内容')).toBeTruthy();
  });

  it('open 受控（表达式绑定）', async () => {
    const { context } = renderDsl({
      type: 'Collapsible',
      props: { title: '更多', open: '${state.showMore}' },
      children: [{ type: 'Text', props: { text: '折叠内容' } }],
    });

    expect(screen.queryByText('折叠内容')).toBeNull();
    act(() => {
      context.state.set('showMore', true);
    });
    expect(await screen.findByText('折叠内容')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Collapsible',
      props: { title: '更多', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=collapsible]'));
  });
});

describe('Tooltip', () => {
  it('悬浮触发元素显示 content 提示浮层', async () => {
    renderDsl({
      type: 'Tooltip',
      props: { content: '删除' },
      children: [{ type: 'Button', props: { text: '移除' } }],
    });

    fireEvent.focus(document.querySelector('[data-slot=tooltip-trigger-wrap]')!);
    expect(await screen.findByText('删除')).toBeTruthy();
  });

  it('通用 props 作用于提示浮层根节点', async () => {
    renderDsl({
      type: 'Tooltip',
      props: { content: '提示', ...COMMON_PROPS },
      children: [{ type: 'Button', props: { text: '触发' } }],
    });

    fireEvent.focus(document.querySelector('[data-slot=tooltip-trigger-wrap]')!);
    await screen.findByText('提示');
    expectCommonProps(document.querySelector('[data-slot=tooltip-content]'));
  });

  it('side 控制浮层朝向（right → data-side=right）', async () => {
    renderDsl({
      type: 'Tooltip',
      props: { content: '新建任务', side: 'right' },
      children: [{ type: 'Button', props: { icon: 'plus' } }],
    });

    fireEvent.focus(document.querySelector('[data-slot=tooltip-trigger-wrap]')!);
    await screen.findByText('新建任务');
    expect(
      document
        .querySelector('[data-slot=tooltip-content]')
        ?.closest('[data-side]')
        ?.getAttribute('data-side'),
    ).toBe('right');
  });
});

describe('HoverCard', () => {
  it('悬浮触发元素显示 content 富内容卡片（DSL 子树）', async () => {
    renderDsl({
      type: 'HoverCard',
      props: { content: { type: 'Text', props: { text: '富内容' } } },
      children: [{ type: 'Link', props: { text: '@pactor', href: '#' } }],
    });

    fireEvent.focus(document.querySelector('[data-slot=hover-card-trigger-wrap]')!);
    expect(await screen.findByText('富内容')).toBeTruthy();
  });

  it('通用 props 作用于卡片浮层根节点', async () => {
    renderDsl({
      type: 'HoverCard',
      props: { content: '简介', ...COMMON_PROPS },
      children: [{ type: 'Link', props: { text: '@pactor', href: '#' } }],
    });

    fireEvent.focus(document.querySelector('[data-slot=hover-card-trigger-wrap]')!);
    await screen.findByText('简介');
    expectCommonProps(document.querySelector('[data-slot=hover-card-content]'));
  });
});

describe('Dialog', () => {
  it('受控 open（表达式绑定）：state 变 true 弹出标题为 DSL title 的对话框', async () => {
    const { context } = renderDsl({
      type: 'Dialog',
      props: { open: '${state.showDialog}', title: '编辑' },
      children: [{ type: 'Text', props: { text: '表单内容' } }],
    });

    expect(screen.queryByText('编辑')).toBeNull();
    act(() => {
      context.state.set('showDialog', true);
    });
    expect(await screen.findByText('编辑')).toBeTruthy();
    expect(screen.getByText('表单内容')).toBeTruthy();
  });

  it('用户关闭时触发 onClose', async () => {
    const { context } = renderDsl({
      type: 'Dialog',
      props: { open: '${state.showDialog}', title: '编辑' },
      events: {
        onClose: { action: 'setState', params: { closed: true } },
      },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    act(() => {
      context.state.set('showDialog', true);
    });
    await screen.findByText('编辑');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expectEventState(context, 'closed', true);
  });

  it('trigger DSL 子树打开非受控对话框', async () => {
    renderDsl({
      type: 'Dialog',
      props: {
        title: '详情',
        trigger: { type: 'Button', props: { text: '打开' } },
      },
      children: [{ type: 'Text', props: { text: '内容' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=dialog-trigger-wrap]')!);
    expect(await screen.findByText('详情')).toBeTruthy();
  });

  it('通用 props 作用于弹层内容根节点', async () => {
    renderDsl({
      type: 'Dialog',
      props: { open: true, title: 'x', ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    await screen.findByRole('dialog');
    expectCommonProps(document.querySelector('[data-slot=dialog-content]'));
  });
});

describe('AlertDialog', () => {
  it('确认链路：点击确认按钮执行 onConfirm 且弹层关闭', async () => {
    const { context } = renderDsl({
      type: 'AlertDialog',
      props: {
        title: '确认删除？',
        description: '该操作不可恢复',
        confirmText: '删除',
        cancelText: '取消',
        trigger: { type: 'Button', props: { text: '删除记录' } },
      },
      events: {
        onConfirm: { action: 'setState', params: { confirmed: true } },
        onCancel: { action: 'setState', params: { cancelled: true } },
      },
    });

    fireEvent.click(document.querySelector('[data-slot=alert-dialog-trigger-wrap]')!);
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog.textContent).toContain('确认删除？');

    fireEvent.click(screen.getByRole('button', { name: '删除' }));
    await expectEventState(context, 'confirmed', true);
    await vi.waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
  });

  it('取消链路：点击取消按钮执行 onCancel 且弹层关闭', async () => {
    const { context } = renderDsl({
      type: 'AlertDialog',
      props: {
        title: '确认删除？',
        trigger: { type: 'Button', props: { text: '删除记录' } },
      },
      events: {
        onCancel: { action: 'setState', params: { cancelled: true } },
      },
    });

    fireEvent.click(document.querySelector('[data-slot=alert-dialog-trigger-wrap]')!);
    await screen.findByRole('alertdialog');
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await expectEventState(context, 'cancelled', true);
    await vi.waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
  });

  it('通用 props 作用于弹层内容根节点', async () => {
    renderDsl({
      type: 'AlertDialog',
      props: { open: true, title: 'x', ...COMMON_PROPS },
    });

    await screen.findByRole('alertdialog');
    expectCommonProps(document.querySelector('[data-slot=alert-dialog-content]'));
  });
});

describe('Drawer', () => {
  it('受控 open：渲染 title 与 children 内容', async () => {
    renderDsl({
      type: 'Drawer',
      props: { open: true, title: '面板', placement: 'right' },
      children: [{ type: 'Text', props: { text: '抽屉内容' } }],
    });

    expect(await screen.findByText('面板')).toBeTruthy();
    expect(screen.getByText('抽屉内容')).toBeTruthy();
  });

  it('Escape 关闭触发 onClose', async () => {
    const { context } = renderDsl({
      type: 'Drawer',
      props: { open: true, title: '面板' },
      events: {
        onClose: { action: 'setState', params: { drawerClosed: true } },
      },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    await screen.findByText('面板');
    fireEvent.keyDown(document, { key: 'Escape' });
    await expectEventState(context, 'drawerClosed', true);
  });

  it('缺省禁止按住面板拖拽关闭（draggable 未开启）', async () => {
    const { context } = renderDsl({
      type: 'Drawer',
      props: { open: true, title: '面板' },
      events: {
        onClose: { action: 'setState', params: { drawerClosed: true } },
      },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    await screen.findByText('面板');
    const content = document.querySelector('[data-slot=drawer-content]')!;
    fireEvent.pointerDown(content, { clientX: 300, clientY: 300 });
    fireEvent.pointerMove(document, { clientX: 80, clientY: 300 });
    fireEvent.pointerUp(document, { clientX: 80, clientY: 300 });

    // 拖拽不触发关闭（vaul handleOnly：仅把手可拖）
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(context.state.get('drawerClosed')).toBeUndefined();
    expect(screen.getByText('面板')).toBeTruthy();
  });

  it('通用 props 作用于抽屉内容根节点', async () => {
    renderDsl({
      type: 'Drawer',
      props: { open: true, title: 'x', ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: '抽屉内容' } }],
    });

    await screen.findByText('抽屉内容');
    expectCommonProps(document.querySelector('[data-slot=drawer-content]'));
  });
});

describe('Sheet', () => {
  it('受控 open + side：渲染标题与内容', async () => {
    renderDsl({
      type: 'Sheet',
      props: { open: true, title: '设置', side: 'left' },
      children: [{ type: 'Text', props: { text: '面板内容' } }],
    });

    expect(await screen.findByText('设置')).toBeTruthy();
    expect(screen.getByText('面板内容')).toBeTruthy();
  });

  it('X 关闭触发 onClose', async () => {
    const { context } = renderDsl({
      type: 'Sheet',
      props: { open: true, title: '设置' },
      events: {
        onClose: { action: 'setState', params: { sheetClosed: true } },
      },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    await screen.findByText('设置');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expectEventState(context, 'sheetClosed', true);
  });

  it('通用 props 作用于面板内容根节点', async () => {
    renderDsl({
      type: 'Sheet',
      props: { open: true, title: 'x', ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: 'x' } }],
    });

    await screen.findByRole('dialog');
    expectCommonProps(document.querySelector('[data-slot=sheet-content]'));
  });
});

describe('Popover', () => {
  it('children 触发元素点击后渲染 content DSL 子树', async () => {
    renderDsl({
      type: 'Popover',
      props: {
        content: { type: 'Text', props: { text: '浮层内容' } },
      },
      children: [{ type: 'Button', props: { text: '打开浮层' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=popover-trigger-wrap]')!);
    expect(await screen.findByText('浮层内容')).toBeTruthy();
  });

  it('通用 props 作用于浮层内容根节点', async () => {
    renderDsl({
      type: 'Popover',
      props: { content: '内容', ...COMMON_PROPS },
      children: [{ type: 'Button', props: { text: '打开' } }],
    });

    fireEvent.click(document.querySelector('[data-slot=popover-trigger-wrap]')!);
    await screen.findByText('内容');
    expectCommonProps(document.querySelector('[data-slot=popover-content]'));
  });
});

describe('Sonner', () => {
  it('挂载点渲染 Toaster 容器', () => {
    const { container } = renderDsl({ type: 'Sonner' });

    expect(container.querySelector('[data-slot=sonner]')).not.toBeNull();
  });

  it('toast 动作：DSL events 调用后渲染 message / description / variant', async () => {
    renderDsl({
      type: 'Flex',
      children: [
        { type: 'Sonner' },
        {
          type: 'Button',
          props: { text: '保存' },
          events: {
            onClick: {
              action: 'toast',
              params: {
                message: '已保存',
                description: '变更已写入',
                variant: 'success',
              },
            },
          },
        },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    const toastEl = (await screen.findByText('已保存')).closest('[data-slot=toast]');
    expect(toastEl).not.toBeNull();
    expect(toastEl!.getAttribute('data-type')).toBe('success');
    expect(screen.getByText('变更已写入')).toBeTruthy();
  });

  it('通用 props 作用于挂载点根节点', () => {
    const { container } = renderDsl({
      type: 'Sonner',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=sonner]'));
  });
});
