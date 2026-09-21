// @vitest-environment jsdom
/**
 * 基础补齐类组件契约（第六批）：
 * Tag / Status / Space / Container / Steps / Anchor / BackTop / Affix 的
 * props 映射、交互行为与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import type { CreateRuntimeContextOptions } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

function renderDsl(node: DslNode, options: CreateRuntimeContextOptions = {}): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node, options);
}

describe('Tag', () => {
  it('渲染文本与语义色（data-color + 语义令牌类）', () => {
    renderDsl({ type: 'Tag', props: { text: '已发布', color: 'success' } });

    const tag = screen.getByText('已发布').closest('[data-slot=tag]')!;
    expect(tag.getAttribute('data-color')).toBe('success');
    expect(tag.className).toContain('text-success');
  });

  it('closable：点击关闭按钮触发 onClose 事件并隐藏自身', async () => {
    const { context } = renderDsl({
      type: 'Tag',
      props: { text: '可移除', closable: true },
      events: { onClose: { action: 'setState', params: { closed: true } } },
    });

    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    await expectEventState(context, 'closed', true);
    expect(screen.queryByText('可移除')).toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Tag', props: { text: '探针', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=tag]'));
  });
});

describe('Status', () => {
  it('渲染状态点与文本；processing 叠加 ping 动画', () => {
    renderDsl({ type: 'Status', props: { status: 'processing', text: '运行中' } });

    const root = screen.getByText('运行中').closest('[data-slot=status]')!;
    expect(root.getAttribute('data-status')).toBe('processing');
    expect(root.querySelector('.animate-ping')).not.toBeNull();
  });

  it('默认 default 态无 ping 动画', () => {
    const { container } = renderDsl({ type: 'Status', props: { text: '空闲' } });

    const root = container.querySelector('[data-slot=status]')!;
    expect(root.getAttribute('data-status')).toBe('default');
    expect(root.querySelector('.animate-ping')).toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Status', props: { text: '探针', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=status]'));
  });
});

describe('Space', () => {
  it('direction / size 档位映射；数字 size 内联 gap', () => {
    const { container } = renderDsl({
      type: 'Space',
      props: { direction: 'vertical', size: 'large' },
      children: [
        { type: 'Text', props: { text: '甲' } },
        { type: 'Text', props: { text: '乙' } },
      ],
    });

    const root = container.querySelector('[data-slot=space]')!;
    expect(root.className).toContain('flex-col');
    expect(root.className).toContain('gap-6');
    expect(screen.getByText('甲')).toBeTruthy();
    expect(screen.getByText('乙')).toBeTruthy();
  });

  it('数字 size 与 style 合并内联', () => {
    const { container } = renderDsl({
      type: 'Space',
      props: { size: 12, ...COMMON_PROPS },
    });

    const root = container.querySelector('[data-slot=space]') as HTMLElement;
    expect(root.style.gap).toBe('12px');
    expectCommonProps(root);
  });
});

describe('Container', () => {
  it('size 档位映射最大宽度；默认居中', () => {
    const { container } = renderDsl({ type: 'Container', props: { size: 'md' } });

    const root = container.querySelector('[data-slot=container]')!;
    expect(root.className).toContain('max-w-screen-md');
    expect(root.className).toContain('mx-auto');
  });

  it('full + centered:false 不限宽不居中；通用 props', () => {
    const { container } = renderDsl({
      type: 'Container',
      props: { size: 'full', centered: false, ...COMMON_PROPS },
    });

    const root = container.querySelector('[data-slot=container]') as HTMLElement;
    expect(root.className).toContain('max-w-none');
    expect(root.className).not.toContain('mx-auto');
    expectCommonProps(root);
  });
});

describe('Steps', () => {
  const items = [
    { title: '提交', description: '已提交' },
    { title: '审核' },
    { title: '完成' },
  ];

  it('按 current 推导状态：finish / process / wait', () => {
    const { container } = renderDsl({ type: 'Steps', props: { items, current: 1 } });

    const nodes = container.querySelectorAll('[data-slot=steps-item]');
    expect(nodes.length).toBe(3);
    expect(nodes[0].getAttribute('data-status')).toBe('finish');
    expect(nodes[1].getAttribute('data-status')).toBe('process');
    expect(nodes[2].getAttribute('data-status')).toBe('wait');
    expect(screen.getByText('已提交')).toBeTruthy();
    // 非末位渲染连接线
    expect(container.querySelectorAll('[data-slot=steps-connector]').length).toBe(2);
  });

  it('item.status 显式覆盖推导（error）', () => {
    const { container } = renderDsl({
      type: 'Steps',
      props: { items: [{ title: '支付', status: 'error' }], current: 0 },
    });

    const node = container.querySelector('[data-slot=steps-item]')!;
    expect(node.getAttribute('data-status')).toBe('error');
    expect(node.querySelector('[data-slot=steps-icon]')!.className).toContain('text-destructive');
  });

  it('vertical 方向；通用 props', () => {
    const { container } = renderDsl({
      type: 'Steps',
      props: { items, current: 0, direction: 'vertical', ...COMMON_PROPS },
    });

    const root = container.querySelector('[data-slot=steps]') as HTMLElement;
    expect(root.className).toContain('flex-col');
    expectCommonProps(root);
  });
});

describe('Anchor', () => {
  it('渲染嵌套链接；点击平滑滚动并高亮当前项', () => {
    const target = document.createElement('div');
    target.id = 'section-a';
    document.body.appendChild(target);
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    renderDsl({
      type: 'Anchor',
      props: {
        items: [
          { href: '#section-a', title: '章节 A', children: [{ href: '#section-a-1', title: 'A-1' }] },
        ],
      },
    });

    expect(screen.getByText('章节 A')).toBeTruthy();
    expect(screen.getByText('A-1')).toBeTruthy();

    fireEvent.click(screen.getByText('章节 A'));
    expect(scrollTo).toHaveBeenCalled();
    expect(screen.getByText('章节 A').getAttribute('data-active')).toBe('true');

    target.remove();
  });

  it('受控 activeKey：激活态由外部驱动，点击仅经 onChange 上报 href', async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    const { context } = renderDsl({
      type: 'Anchor',
      props: {
        activeKey: '#a',
        items: [
          { href: '#a', title: '章节 A' },
          { href: '#b', title: '章节 B' },
        ],
      },
      events: { onChange: { action: 'setState', params: { active: '${event}' } } },
    });

    // 受控：激活态始终跟随 activeKey
    expect(screen.getByText('章节 A').getAttribute('data-active')).toBe('true');
    expect(screen.getByText('章节 B').getAttribute('data-active')).toBeNull();

    // 点击 B：上报 onChange，但激活态不自行切换（无目标元素也不影响上报）
    fireEvent.click(screen.getByText('章节 B'));
    await expectEventState(context, 'active', '#b');
    expect(screen.getByText('章节 A').getAttribute('data-active')).toBe('true');
  });

  it('通用 props', () => {
    const { container } = renderDsl({
      type: 'Anchor',
      props: { items: [{ href: '#x', title: '探针' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=anchor]'));
  });
});

describe('BackTop', () => {
  it('滚动超过 visibilityHeight 后渲染按钮，点击回到顶部', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });

    renderDsl({ type: 'BackTop', props: { visibilityHeight: 400 } });

    const button = screen.getByRole('button', { name: '回到顶部' });
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('未超过阈值不渲染', () => {
    renderDsl({ type: 'BackTop', props: { visibilityHeight: 400 } });

    expect(screen.queryByRole('button', { name: '回到顶部' })).toBeNull();
  });
});

describe('Affix', () => {
  it('sticky + offsetTop 内联；通用 props', () => {
    const { container } = renderDsl({
      type: 'Affix',
      props: { offsetTop: 64, ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: '吸附内容' } }],
    });

    const root = container.querySelector('[data-slot=affix]') as HTMLElement;
    expect(root.className).toContain('sticky');
    expect(root.style.top).toBe('64px');
    expect(screen.getByText('吸附内容')).toBeTruthy();
    expectCommonProps(root);
  });

  it('offsetBottom 优先于 offsetTop', () => {
    const { container } = renderDsl({
      type: 'Affix',
      props: { offsetTop: 10, offsetBottom: 20 },
    });

    const root = container.querySelector('[data-slot=affix]') as HTMLElement;
    expect(root.style.bottom).toBe('20px');
    expect(root.style.top).toBe('');
  });
});
