// @vitest-environment jsdom
/**
 * 数据展示类组件契约（第五批）：
 * List / Tree / Descriptions / Timeline / Image / QRCode / Segmented 的
 * props 映射、受控/非受控、Form 集成（Segmented）与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';
import type { CreateRuntimeContextOptions } from '@pactor-app/runtime';
import type { DslNode } from '@pactor-app/core';

const COMMON_PROPS = COMMON_PROPS_PROBE;

function renderDsl(node: DslNode, options: CreateRuntimeContextOptions = {}): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node, options);
}

describe('List', () => {
  it('渲染 items：title / description / extra / 占位文本 avatar', () => {
    renderDsl({
      type: 'List',
      props: {
        items: [
          { key: '1', title: '张三', description: '前端工程师', avatar: '张', extra: '在线' },
          { key: '2', title: '李四', description: '产品经理' },
        ],
      },
    });

    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('前端工程师')).toBeTruthy();
    expect(screen.getByText('在线')).toBeTruthy();
    expect(screen.getByText('李四')).toBeTruthy();
    expect(screen.getByText('张').getAttribute('data-slot')).toBe('list-item-avatar');
  });

  it('空 items 渲染空态文案', () => {
    renderDsl({ type: 'List', props: { items: [] } });

    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  it('split 缺省 true 渲染分隔线；false 取消', () => {
    const { container, unmount } = renderDsl({
      type: 'List',
      props: { items: [{ title: 'a' }, { title: 'b' }] },
    });
    expect(container.querySelector('[data-slot=list]')!.className).toContain('divide-y');
    unmount();

    const { container: c2 } = renderDsl({
      type: 'List',
      props: { items: [{ title: 'a' }], split: false },
    });
    expect(c2.querySelector('[data-slot=list]')!.className).not.toContain('divide-y');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'List',
      props: { items: [{ title: 'a' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=list]'));
  });
});

describe('Tree', () => {
  const treeData = [
    {
      key: 'parent',
      title: '父节点',
      children: [
        { key: 'child-1', title: '子节点一' },
        { key: 'child-2', title: '子节点二', disabled: true },
      ],
    },
    { key: 'leaf', title: '叶子节点' },
  ];

  it('缺省收起子节点；点击 chevron 展开并触发 onExpand', async () => {
    const { context } = renderDsl({
      type: 'Tree',
      props: { treeData },
      events: {
        onExpand: { action: 'setState', params: { expanded: '${event}' } },
      },
    });

    expect(screen.queryByText('子节点一')).toBeNull();
    const switcher = document.querySelector('[data-slot=tree-node][data-key=parent] [data-slot=tree-switcher]')!;
    fireEvent.click(switcher);

    expect(screen.getByText('子节点一')).toBeTruthy();
    await expectEventState(context, 'expanded', ['parent']);
  });

  it('defaultExpandedKeys 初始展开；点击节点触发 onSelect 传出 keys', async () => {
    const { context } = renderDsl({
      type: 'Tree',
      props: { treeData, defaultExpandedKeys: ['parent'] },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    expect(screen.getByText('子节点一')).toBeTruthy();
    fireEvent.click(screen.getByText('子节点一'));
    await expectEventState(context, 'selected', ['child-1']);
  });

  it('checkable：勾选后 onCheck 传出勾选 keys', async () => {
    const { container, context } = renderDsl({
      type: 'Tree',
      props: { treeData, checkable: true },
      events: {
        onCheck: { action: 'setState', params: { checked: '${event}' } },
      },
    });

    const node = container.querySelector('[data-slot=tree-node][data-key=leaf]')!;
    fireEvent.click(node.querySelector('[data-slot=checkbox]')!);
    await expectEventState(context, 'checked', ['leaf']);
  });

  it('受控 expandedKeys：内部点击不改变展开状态（仅触发事件）', () => {
    renderDsl({
      type: 'Tree',
      props: { treeData, expandedKeys: [] },
    });

    const switcher = document.querySelector('[data-slot=tree-node][data-key=parent] [data-slot=tree-switcher]')!;
    fireEvent.click(switcher);
    expect(screen.queryByText('子节点一')).toBeNull();
  });

  it('disabled 节点不可选中', () => {
    const { context } = renderDsl({
      type: 'Tree',
      props: { treeData, defaultExpandedKeys: ['parent'] },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    fireEvent.click(screen.getByText('子节点二'));
    expect(screen.getByText('子节点二').closest('[aria-selected]')!.getAttribute('aria-selected')).toBe('false');
    expect(context.state.get('selected')).toBeUndefined();
  });
});

describe('Descriptions', () => {
  it('渲染 title 与 items，column 控制栅格列数', () => {
    const { container } = renderDsl({
      type: 'Descriptions',
      props: {
        title: '用户信息',
        column: 2,
        items: [
          { label: '姓名', value: '张三' },
          { label: '年龄', value: 28 },
          { label: '城市', value: '杭州' },
        ],
      },
    });

    expect(screen.getByText('用户信息')).toBeTruthy();
    expect(screen.getByText('姓名')).toBeTruthy();
    expect(screen.getByText('28')).toBeTruthy();
    const grid = container.querySelector('[data-slot=descriptions-grid]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('repeat(2');
    expect(container.querySelectorAll('[data-slot=descriptions-item]')).toHaveLength(3);
  });

  it('bordered 渲染边框栅格（label 单元格带 muted 底）', () => {
    const { container } = renderDsl({
      type: 'Descriptions',
      props: {
        bordered: true,
        items: [{ label: '姓名', value: '张三' }],
      },
    });

    const grid = container.querySelector('[data-slot=descriptions-grid]')!;
    expect(grid.className).toContain('border');
    const label = container.querySelector('[data-slot=descriptions-item-label]')!;
    expect(label.className).toContain('bg-muted');
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Descriptions',
      props: { items: [{ label: 'a', value: 'b' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=descriptions]'));
  });
});

describe('Timeline', () => {
  it('渲染 items：content / time；color 覆盖圆点颜色', () => {
    const { container } = renderDsl({
      type: 'Timeline',
      props: {
        items: [
          { content: '创建订单', time: '10:00' },
          { content: '支付成功', color: 'rgb(0, 128, 0)' },
        ],
      },
    });

    expect(screen.getByText('创建订单')).toBeTruthy();
    expect(screen.getByText('10:00')).toBeTruthy();
    const dots = container.querySelectorAll('[data-slot=timeline-dot]');
    expect(dots).toHaveLength(2);
    expect((dots[1].firstElementChild as HTMLElement).style.backgroundColor).toBe('rgb(0, 128, 0)');
  });

  it('pending: true 追加「进行中」节点；字符串为自定义文案', () => {
    const { unmount } = renderDsl({
      type: 'Timeline',
      props: { items: [{ content: '第一步' }], pending: true },
    });
    expect(screen.getByText('进行中')).toBeTruthy();
    unmount();

    renderDsl({
      type: 'Timeline',
      props: { items: [{ content: '第一步' }], pending: '等待发布' },
    });
    expect(screen.getByText('等待发布')).toBeTruthy();
  });

  it('icon 字段渲染白名单图标', () => {
    const { container } = renderDsl({
      type: 'Timeline',
      props: { items: [{ content: '完成', icon: 'check' }] },
    });

    expect(container.querySelector('[data-slot=timeline-dot] [data-slot=icon]')).not.toBeNull();
  });
});

describe('Image', () => {
  it('渲染图片；width / height 数字透传', () => {
    const { container } = renderDsl({
      type: 'Image',
      props: { src: 'https://example.com/a.png', alt: '示例', width: 120, height: 80, preview: false },
    });

    const img = container.querySelector('[data-slot=image]') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://example.com/a.png');
    expect(img.getAttribute('width')).toBe('120');
    expect(img.getAttribute('height')).toBe('80');
  });

  it('加载失败显示自定义 fallback', () => {
    const { container } = renderDsl({
      type: 'Image',
      props: { src: 'https://example.com/broken.png', fallback: '图片加载失败' },
    });

    fireEvent.error(container.querySelector('[data-slot=image]')!);
    expect(screen.getByText('图片加载失败')).toBeTruthy();
    expect(container.querySelector('[data-slot=image-fallback]')).not.toBeNull();
  });

  it('加载失败且未指定 fallback 时渲染默认占位块', () => {
    const { container } = renderDsl({
      type: 'Image',
      props: { src: 'https://example.com/broken.png' },
    });

    fireEvent.error(container.querySelector('[data-slot=image]')!);
    const fallback = container.querySelector('[data-slot=image-fallback]')!;
    expect(fallback.querySelector('[data-slot=icon]')).not.toBeNull();
  });

  it('无 src 直接渲染占位块', () => {
    const { container } = renderDsl({ type: 'Image' });

    expect(container.querySelector('[data-slot=image-fallback]')).not.toBeNull();
  });
});

describe('QRCode', () => {
  it('value 生成内联 svg', async () => {
    const { container } = renderDsl({
      type: 'QRCode',
      props: { value: 'https://example.com' },
    });

    await vi.waitFor(() => {
      expect(container.querySelector('[data-slot=qrcode-svg] svg')).not.toBeNull();
    });
    expect(container.querySelector('[data-slot=qrcode-placeholder]')).toBeNull();
  });

  it('value 为空时渲染占位块', () => {
    const { container } = renderDsl({ type: 'QRCode' });

    expect(container.querySelector('[data-slot=qrcode-placeholder]')).not.toBeNull();
  });

  it('size 控制渲染尺寸', async () => {
    const { container } = renderDsl({
      type: 'QRCode',
      props: { value: 'abc', size: 96 },
    });

    await vi.waitFor(() => {
      const box = container.querySelector('[data-slot=qrcode-svg]') as HTMLElement;
      expect(box).not.toBeNull();
      expect(box.style.width).toBe('96px');
      expect(box.style.height).toBe('96px');
    });
  });
});

describe('Segmented', () => {
  const options = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week', icon: 'calendar' },
    { label: '月', value: 'month', disabled: true },
  ];

  it('点击选项 onChange 传出选中 value；选中项高亮', async () => {
    const { container, context } = renderDsl({
      type: 'Segmented',
      props: { options, value: 'day' },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    const week = container.querySelector('[data-slot=segmented-item][data-value=week]')!;
    expect(week.querySelector('[data-slot=icon]')).not.toBeNull();
    fireEvent.click(week);
    await expectEventState(context, 'period', 'week');
  });

  it('disabled 选项点击不触发 onChange', () => {
    const { container, context } = renderDsl({
      type: 'Segmented',
      props: { options },
      events: {
        onChange: { action: 'setState', params: { period: '${event}' } },
      },
    });

    fireEvent.click(container.querySelector('[data-slot=segmented-item][data-value=month]')!);
    expect(context.state.get('period')).toBeUndefined();
  });

  it('非受控独立渲染：点击切换内部选中态', () => {
    const { container } = renderDsl({
      type: 'Segmented',
      props: { options },
    });

    const week = container.querySelector('[data-slot=segmented-item][data-value=week]')!;
    fireEvent.click(week);
    expect(week.getAttribute('aria-checked')).toBe('true');
  });

  it('Form 内声明 name 成为表单项，提交收集选中值', async () => {
    const { container, context } = renderDsl({
      type: 'Form',
      children: [
        { type: 'Segmented', props: { name: 'period', label: '周期', options } },
        { type: 'Button', props: { text: '提交', submit: true } },
      ],
    });

    expect(container.querySelector('[data-slot=form-item]')).not.toBeNull();
    fireEvent.click(container.querySelector('[data-slot=segmented-item][data-value=week]')!);
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    await vi.waitFor(() => {
      expect(context.state.get('form')).toEqual({ period: 'week' });
    });
  });

  it('通用 props 作用于根节点（独立渲染）', () => {
    const { container } = renderDsl({
      type: 'Segmented',
      props: { options, ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=segmented]'));
  });
});
