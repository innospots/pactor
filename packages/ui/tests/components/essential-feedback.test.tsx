// @vitest-environment jsdom
/**
 * 基础反馈类组件契约：Message / Notification / Popconfirm / Result /
 * LoadingOverlay / Watermark / Tour 的渲染冒烟、事件链路与通用 props。
 */
import { DslRenderer } from '@pactor-app/runtime';
import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { LoadingOverlay } from '../../src/components/components/LoadingOverlay/index.js';
import { Message } from '../../src/components/components/Message/index.js';
import { Notification } from '../../src/components/components/Notification/index.js';
import { Popconfirm } from '../../src/components/components/Popconfirm/index.js';
import { Result } from '../../src/components/components/Result/index.js';
import { Tour } from '../../src/components/components/Tour/index.js';
import { Watermark } from '../../src/components/components/Watermark/index.js';
import { toastManager } from '../../src/ui/toast.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

import type { DslNode } from '@pactor-app/core';

const COMMON_PROPS = COMMON_PROPS_PROBE;

const feedbackComponents = {
  Message,
  Notification,
  Popconfirm,
  Result,
  LoadingOverlay,
  Watermark,
  Tour,
} as const;

/** 经内置注册表渲染（`has` 守卫保留本地注册的向后兼容） */
function renderFeedback(
  node: DslNode,
  options: Parameters<typeof renderDslWith>[2] = {},
): RenderDslResult {
  const registry = createComponentRegistry();
  for (const [name, component] of Object.entries(feedbackComponents)) {
    if (!registry.has(name)) {
      registry.register(name, component);
    }
  }
  return renderDslWith(registry, node, options);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Message', () => {
  it('渲染 hidden 标记节点（通用 props 正常挂载）', () => {
    const { container } = renderFeedback({
      type: 'Message',
      props: { ...COMMON_PROPS },
    });

    const marker = container.querySelector('[data-slot=message]');
    expect(marker).not.toBeNull();
    expect(marker!.hasAttribute('hidden')).toBe(true);
    expect(marker!.classList.contains(COMMON_PROPS_PROBE.className)).toBe(true);
    expect((marker as HTMLElement).style.opacity).toBe('0.5');
  });

  it('content 非空时经 toast() 发全局短 toast（variant/duration 透传）', () => {
    const add = vi.spyOn(toastManager, 'add').mockReturnValue('toast-id');

    renderFeedback({
      type: 'Message',
      props: { content: '已保存', variant: 'success', duration: 3000 },
    });

    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ title: '已保存', type: 'success', timeout: 3000 }),
    );
  });

  it('仅在 content 引用变化且非空时重发', () => {
    const add = vi.spyOn(toastManager, 'add').mockReturnValue('toast-id');
    const { context, rerender } = renderFeedback({
      type: 'Message',
      props: { content: '第一条' },
    });
    expect(add).toHaveBeenCalledTimes(1);

    rerender(
      <DslRenderer
        context={context}
        node={{ type: 'Message', props: { content: '第一条' } }}
      />,
    );
    expect(add).toHaveBeenCalledTimes(1);

    rerender(
      <DslRenderer
        context={context}
        node={{ type: 'Message', props: { content: '' } }}
      />,
    );
    expect(add).toHaveBeenCalledTimes(1);

    rerender(
      <DslRenderer
        context={context}
        node={{ type: 'Message', props: { content: '第二条' } }}
      />,
    );
    expect(add).toHaveBeenCalledTimes(2);
    expect(add).toHaveBeenLastCalledWith(
      expect.objectContaining({ title: '第二条', type: 'info' }),
    );
  });
});

describe('Notification', () => {
  it('渲染 hidden 标记节点', () => {
    const { container } = renderFeedback({ type: 'Notification' });

    const marker = container.querySelector('[data-slot=notification]');
    expect(marker).not.toBeNull();
    expect(marker!.hasAttribute('hidden')).toBe(true);
  });

  it('title 非空时发 title+description 的富通知 toast（warning 变体）', () => {
    const add = vi.spyOn(toastManager, 'add').mockReturnValue('toast-id');

    renderFeedback({
      type: 'Notification',
      props: {
        title: '构建完成',
        description: '共 12 个产物',
        variant: 'warning',
      },
    });

    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '构建完成',
        description: '共 12 个产物',
        type: 'warning',
      }),
    );
  });
});

describe('Popconfirm', () => {
  it('确认链路：点击确定执行 onConfirm 且浮层关闭', async () => {
    const { context } = renderFeedback({
      type: 'Popconfirm',
      props: { title: '确认删除？', description: '该操作不可恢复' },
      events: {
        onConfirm: { action: 'setState', params: { confirmed: true } },
      },
      children: [{ type: 'Button', props: { text: '删除' } }],
    });

    fireEvent.click(
      document.querySelector('[data-slot=popconfirm-trigger-wrap]')!,
    );
    expect(await screen.findByText('确认删除？')).toBeTruthy();
    expect(screen.getByText('该操作不可恢复')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '确定' }));
    await expectEventState(context, 'confirmed', true);
    await vi.waitFor(() => {
      expect(screen.queryByText('确认删除？')).toBeNull();
    });
  });

  it('取消链路：自定义文案，点击取消执行 onCancel 且浮层关闭', async () => {
    const { context } = renderFeedback({
      type: 'Popconfirm',
      props: { title: '放弃修改？', confirmText: '放弃', cancelText: '再想想' },
      events: {
        onCancel: { action: 'setState', params: { cancelled: true } },
      },
      children: [{ type: 'Button', props: { text: '重置' } }],
    });

    fireEvent.click(
      document.querySelector('[data-slot=popconfirm-trigger-wrap]')!,
    );
    await screen.findByText('放弃修改？');

    fireEvent.click(screen.getByRole('button', { name: '再想想' }));
    await expectEventState(context, 'cancelled', true);
    await vi.waitFor(() => {
      expect(screen.queryByText('放弃修改？')).toBeNull();
    });
  });

  it('通用 props 作用于浮层内容根节点', async () => {
    renderFeedback({
      type: 'Popconfirm',
      props: { title: '提示', ...COMMON_PROPS },
      children: [{ type: 'Button', props: { text: '打开' } }],
    });

    fireEvent.click(
      document.querySelector('[data-slot=popconfirm-trigger-wrap]')!,
    );
    await screen.findByText('提示');
    expectCommonProps(document.querySelector('[data-slot=popover-content]'));
  });
});

describe('Result', () => {
  it('success：图标 + 标题 + 副标题 + 操作区（children DSL 子树）', () => {
    const { container } = renderFeedback({
      type: 'Result',
      props: { status: 'success', title: '提交成功', subTitle: '预计 1 分钟内生效' },
      children: [{ type: 'Button', props: { text: '返回列表' } }],
    });

    const root = container.querySelector('[data-slot=result]');
    expect(root).not.toBeNull();
    expect(root!.getAttribute('data-status')).toBe('success');
    expect(root!.querySelector('[data-slot=result-icon] svg')).not.toBeNull();
    expect(screen.getByText('提交成功')).toBeTruthy();
    expect(screen.getByText('预计 1 分钟内生效')).toBeTruthy();
    expect(screen.getByRole('button', { name: '返回列表' })).toBeTruthy();
  });

  it('各 status：语义态渲染图标，404/403/500 渲染状态码大字', () => {
    const { container } = renderFeedback({
      type: 'Flex',
      children: [
        { type: 'Result', props: { status: 'error', title: '失败' } },
        { type: 'Result', props: { status: 'warning', title: '警告' } },
        { type: 'Result', props: { status: '404', title: '页面不存在' } },
        { type: 'Result', props: { status: '500', title: '服务器错误' } },
      ],
    });

    const results = container.querySelectorAll('[data-slot=result]');
    expect(results.length).toBe(4);
    expect(results[0]!.getAttribute('data-status')).toBe('error');
    expect(results[0]!.querySelector('svg')).not.toBeNull();
    expect(results[1]!.querySelector('svg')).not.toBeNull();
    expect(results[2]!.textContent).toContain('404');
    expect(results[2]!.querySelector('svg')).toBeNull();
    expect(results[3]!.textContent).toContain('500');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderFeedback({
      type: 'Result',
      props: { status: 'info', title: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=result]'));
  });
});

describe('LoadingOverlay', () => {
  it('loading=true：覆盖半透明层（Spinner + text）', () => {
    const { container } = renderFeedback({
      type: 'LoadingOverlay',
      props: { loading: true, text: '加载中…' },
      children: [{ type: 'Text', props: { text: '区块内容' } }],
    });

    expect(screen.getByText('区块内容')).toBeTruthy();
    const mask = container.querySelector('[data-slot=loading-overlay-mask]');
    expect(mask).not.toBeNull();
    expect(mask!.querySelector('[data-slot=spinner]')).not.toBeNull();
    expect(screen.getByText('加载中…')).toBeTruthy();
  });

  it('loading 切换为 false 时只渲染 children（表达式绑定）', async () => {
    const { context, container } = renderFeedback({
      type: 'LoadingOverlay',
      props: { loading: '${state.loading}' },
      children: [{ type: 'Text', props: { text: '区块内容' } }],
    });

    expect(container.querySelector('[data-slot=loading-overlay-mask]')).toBeNull();
    act(() => {
      context.state.set('loading', true);
    });
    await vi.waitFor(() => {
      expect(
        container.querySelector('[data-slot=loading-overlay-mask]'),
      ).not.toBeNull();
    });
    act(() => {
      context.state.set('loading', false);
    });
    await vi.waitFor(() => {
      expect(container.querySelector('[data-slot=loading-overlay-mask]')).toBeNull();
    });
    expect(screen.getByText('区块内容')).toBeTruthy();
  });

  it('无 children 时退化为独立 Spinner', () => {
    const { container } = renderFeedback({
      type: 'LoadingOverlay',
      props: { loading: true },
    });

    const root = container.querySelector('[data-slot=loading-overlay]');
    expect(root).not.toBeNull();
    expect(root!.querySelector('[data-slot=spinner]')).not.toBeNull();
  });
});

describe('Watermark', () => {
  it('content 渲染 SVG data-uri 平铺背景层（多行纵向排列）', () => {
    const { container } = renderFeedback({
      type: 'Watermark',
      props: { content: ['机密', '内部使用'] },
      children: [{ type: 'Text', props: { text: '正文' } }],
    });

    const layer = container.querySelector('[data-slot=watermark-layer]');
    expect(layer).not.toBeNull();
    const bg = (layer as HTMLElement).style.backgroundImage;
    expect(bg).toContain('data:image/svg+xml');
    const decoded = decodeURIComponent(bg);
    expect(decoded).toContain('机密');
    expect(decoded).toContain('内部使用');
    expect(decoded).toContain('rotate(-22');
    expect(screen.getByText('正文')).toBeTruthy();
  });

  it('单行 content + 通用 props 作用于根节点', () => {
    const { container } = renderFeedback({
      type: 'Watermark',
      props: { content: '水印', ...COMMON_PROPS },
    });

    expectCommonProps(container.querySelector('[data-slot=watermark]'));
    expect(
      container.querySelector('[data-slot=watermark-layer]'),
    ).not.toBeNull();
  });
});

describe('Tour', () => {
  const steps = [
    { target: '#tour-anchor', title: '第一步', content: '这是第一步' },
    { target: '.missing-target', title: '第二步', content: '这是第二步' },
  ];

  it('open 时渲染遮罩与步骤卡片（按 target 元素定位）', () => {
    const anchor = document.createElement('div');
    anchor.id = 'tour-anchor';
    document.body.appendChild(anchor);

    renderFeedback({ type: 'Tour', props: { open: true, steps } });

    expect(document.querySelector('[data-slot=tour-mask]')).not.toBeNull();
    const card = document.querySelector('[data-slot=tour-card]') as HTMLElement;
    expect(card).not.toBeNull();
    expect(card.style.transform).toBe('');
    expect(screen.getByText('第一步')).toBeTruthy();
    expect(screen.getByText('这是第一步')).toBeTruthy();
    anchor.remove();
  });

  it('逐步：下一步触发 onChange；选择器无匹配时居中兜底不抛错；末步完成触发 onClose', async () => {
    const { context } = renderFeedback({
      type: 'Tour',
      props: { open: true, steps },
      events: {
        onChange: { action: 'setState', params: { tourStep: '${event}' } },
        onClose: { action: 'setState', params: { tourClosed: true } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    await expectEventState(context, 'tourStep', 1);

    // 第二步 target 无匹配：卡片居中兜底渲染
    expect(await screen.findByText('第二步')).toBeTruthy();
    const card = document.querySelector('[data-slot=tour-card]') as HTMLElement;
    expect(card.style.transform).toContain('translate(-50%, -50%)');

    fireEvent.click(screen.getByRole('button', { name: '完成' }));
    await expectEventState(context, 'tourClosed', true);
  });

  it('关闭按钮触发 onClose', async () => {
    const { context } = renderFeedback({
      type: 'Tour',
      props: { open: true, steps },
      events: {
        onClose: { action: 'setState', params: { tourClosed: true } },
      },
    });

    fireEvent.click(document.querySelector('[data-slot=tour-close]')!);
    await expectEventState(context, 'tourClosed', true);
  });

  it('open=false 时不渲染遮罩与卡片', () => {
    renderFeedback({ type: 'Tour', props: { open: false, steps } });

    expect(document.querySelector('[data-slot=tour-mask]')).toBeNull();
    expect(document.querySelector('[data-slot=tour-card]')).toBeNull();
  });
});
