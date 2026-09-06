// @vitest-environment jsdom
/**
 * 扩展展示类组件契约（spec: shadcn-extended-components / 展示类组件）：
 * Badge / Avatar / Skeleton / Separator / Kbd / Spinner / Empty /
 * AspectRatio / Progress 的 props 映射、DSL 子树与通用 props。
 */
import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { COMMON_PROPS_PROBE, expectCommonProps, renderDsl } from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Badge', () => {
  it('variant: secondary 渲染 secondary 样式且文本为 DSL text', () => {
    renderDsl({
      type: 'Badge',
      props: { text: '草稿', variant: 'secondary' },
    });

    const badge = screen.getByText('草稿');
    expect(badge.getAttribute('data-slot')).toBe('badge');
    expect(badge.className).toContain('bg-secondary');
  });

  it.each([
    ['default', 'bg-primary'],
    ['secondary', 'bg-secondary'],
    ['destructive', 'bg-destructive'],
    ['outline', 'border-border'],
  ] as const)('variant: %s 映射对应语义类', (variant, expectedClass) => {
    renderDsl({ type: 'Badge', props: { text: 'x', variant } });

    expect(screen.getByText('x').className).toContain(expectedClass);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Badge',
      props: { text: 'x', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=badge]'));
  });
});

describe('Avatar', () => {
  it('无 src 时渲染 fallback 占位文本', () => {
    renderDsl({
      type: 'Avatar',
      props: { alt: '张三', fallback: '张' },
    });

    expect(screen.getByText('张')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Avatar',
      props: { fallback: '张', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=avatar]'));
  });
});

describe('Skeleton', () => {
  it('shape: circle 渲染圆形且应用 width / height', () => {
    const { container } = renderDsl({
      type: 'Skeleton',
      props: { shape: 'circle', width: 48, height: 48 },
    });

    const skeleton = container.querySelector('[data-slot=skeleton]') as HTMLElement;
    expect(skeleton.className).toContain('rounded-full');
    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('48px');
  });

  it('shape: line / rect 缺省尺寸渲染', () => {
    for (const shape of ['line', 'rect'] as const) {
      const { container, unmount } = renderDsl({
        type: 'Skeleton',
        props: { shape },
      });
      expect(container.querySelector('[data-slot=skeleton]')).not.toBeNull();
      unmount();
    }
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Skeleton',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=skeleton]'));
  });
});

describe('Separator', () => {
  it('orientation: vertical 渲染垂直分隔线', () => {
    const { container } = renderDsl({
      type: 'Separator',
      props: { orientation: 'vertical' },
    });

    const separator = container.querySelector('[data-slot=separator]')!;
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
  });

  it('缺省渲染 horizontal', () => {
    const { container } = renderDsl({ type: 'Separator' });

    const separator = container.querySelector('[data-slot=separator]')!;
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Separator',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=separator]'));
  });
});

describe('Kbd', () => {
  it('渲染键盘按键样式文本', () => {
    const { container } = renderDsl({ type: 'Kbd', props: { text: '⌘K' } });

    const kbd = container.querySelector('kbd')!;
    expect(kbd.textContent).toBe('⌘K');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Kbd',
      props: { text: 'K', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=kbd]'));
  });
});

describe('Spinner', () => {
  it('渲染加载指示器（role=status）', () => {
    renderDsl({ type: 'Spinner' });

    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('size: lg 映射大尺寸类', () => {
    renderDsl({ type: 'Spinner', props: { size: 'lg' } });

    expect(screen.getByRole('status').getAttribute('class')).toContain('size-6');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Spinner',
      props: { ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=spinner]'));
  });
});

describe('Empty', () => {
  it('渲染 title / description 与 children 操作区', () => {
    renderDsl({
      type: 'Empty',
      props: { title: '暂无数据', description: '创建一条记录试试' },
      children: [{ type: 'Button', props: { text: '新建' } }],
    });

    expect(screen.getByText('暂无数据')).toBeTruthy();
    expect(screen.getByText('创建一条记录试试')).toBeTruthy();
    expect(screen.getByRole('button', { name: '新建' })).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Empty',
      props: { title: '空', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=empty]'));
  });
});

describe('AspectRatio', () => {
  it('ratio: 16/9 按比例约束渲染 children', () => {
    const { container } = renderDsl({
      type: 'AspectRatio',
      props: { ratio: '16/9' },
      children: [{ type: 'Text', props: { text: '内容' } }],
    });

    const root = container.querySelector('[data-slot=aspect-ratio]') as HTMLElement;
    expect(root.style.aspectRatio).toBe('16/9');
    expect(screen.getByText('内容')).toBeTruthy();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'AspectRatio',
      props: { ratio: 1, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=aspect-ratio]'));
  });
});

describe('Progress', () => {
  it('value 渲染对应百分比进度条', () => {
    renderDsl({ type: 'Progress', props: { value: 40 } });

    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('value 支持表达式解析后的数字', async () => {
    const { context } = renderDsl(
      {
        type: 'Progress',
        props: { value: '${data.progress}' },
      },
      {
        dataSources: {
          progress: { type: 'static', value: 72, autoLoad: true },
        },
      },
    );

    // 未经 PageRuntime 时手动触发 autoLoad
    await act(async () => {
      await context.data.init();
    });

    await vi.waitFor(() => {
      expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('72');
    });
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Progress',
      props: { value: 10, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=progress]'));
  });
});
