// @vitest-environment jsdom
/**
 * @pactor-app/grid-layout 契约：
 * - buildGridLayout：声明项优先（透传 minW/static 等字段），缺失 child 整行追加在声明布局底部；
 * - 格子 id：child props.gridId > node.id > 下标；
 * - DSL 路径以 withScope 注册，dslChildren 逐项包 keyed 格子容器交给 RGL；
 * - 事件载荷：onLayoutChange 携带 { layout }，拖拽/缩放携带 { layout, item, oldItem }；
 * - compactType 映射 compactor（vertical / horizontal / none）。
 * 底层 react-grid-layout 以 mock 替身断言 props 透传，不加载真实拖拽链。
 */
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const rglSpy = vi.fn((_props: Record<string, unknown>) => null);
const containerWidth = { width: 1200, mounted: true };

vi.mock('react-grid-layout', () => ({
  default: (props: Record<string, unknown>) => {
    rglSpy(props);
    return <div data-mock-rgl>{props.children as React.ReactNode}</div>;
  },
  useContainerWidth: () => ({ ...containerWidth, containerRef: () => undefined }),
  verticalCompactor: { name: 'vertical' },
  horizontalCompactor: { name: 'horizontal' },
  noCompactor: { name: 'none' },
}));

// 用最小替身模拟 Renderer 上下文：renderChildren 把 DSL 节点渲染为占位 div
vi.mock('@pactor-app/runtime', () => ({
  useRenderer: () => ({
    renderChildren: (children: Array<{ type?: string }>) =>
      children.map((child, index) => (
        <div key={index} data-mock-child={child.type} />
      )),
  }),
}));

import {
  buildGridLayout,
  createGridLayoutComponentRegistry,
  GridLayout,
} from '../src/index.js';

afterEach(() => {
  cleanup();
  rglSpy.mockClear();
});

function lastRglProps(): Record<string, any> {
  return rglSpy.mock.calls[rglSpy.mock.calls.length - 1]![0] as Record<string, any>;
}

describe('buildGridLayout', () => {
  it('声明项按 gridId 匹配并透传扩展字段', () => {
    const layout = buildGridLayout(
      ['a', 'b'],
      [{ i: 'b', x: 3, y: 0, w: 6, h: 4, minW: 4, static: true }],
      12,
    );
    expect(layout.find((item) => item.i === 'b')).toMatchObject({
      x: 3, y: 0, w: 6, h: 4, minW: 4, static: true,
    });
  });

  it('缺失 child 整行追加在已声明布局底部', () => {
    const layout = buildGridLayout(['a', 'b', 'c'], [{ i: 'b', x: 0, y: 0, w: 6, h: 2 }], 12);
    expect(layout.find((item) => item.i === 'a')).toMatchObject({ x: 0, y: 2, w: 12, h: 4 });
    expect(layout.find((item) => item.i === 'c')).toMatchObject({ x: 0, y: 6, w: 12, h: 4 });
  });

  it('无 layout 时全部 child 从顶部整行堆叠', () => {
    const layout = buildGridLayout(['0', '1'], undefined, 12);
    expect(layout).toEqual([
      { i: '0', x: 0, y: 0, w: 12, h: 4 },
      { i: '1', x: 0, y: 4, w: 12, h: 4 },
    ]);
  });
});

describe('GridLayout（DSL 路径）', () => {
  const dslChildren = [
    { type: 'MetricCard', props: { gridId: 'kpi-1', title: '订单' } },
    { type: 'LineChart', id: 'chart-1' },
    { type: 'Card' },
  ];

  it('withScope 注册：dslChildren 逐项包 keyed 格子容器，gridId > node.id > 下标', () => {
    render(
      <GridLayout
        dslChildren={dslChildren}
        layout={[{ i: 'kpi-1', x: 0, y: 0, w: 4, h: 2 }]}
      />,
    );
    const props = lastRglProps();
    const ids = props.layout.map((item: { i: string }) => item.i);
    expect(ids).toEqual(['kpi-1', 'chart-1', '2']);
    const wrappers = document.querySelectorAll('[data-slot="grid-layout-item"]');
    expect(wrappers.length).toBe(3);
  });

  it('gridConfig / dragConfig / resizeConfig 默认值与具名 props 透传', () => {
    render(
      <GridLayout
        dslChildren={dslChildren}
        cols={6}
        rowHeight={100}
        draggable={false}
        resizable={true}
        resizeHandles={['se', 'e']}
        bounded
      />,
    );
    const props = lastRglProps();
    expect(props.gridConfig).toMatchObject({
      cols: 6,
      rowHeight: 100,
      margin: [16, 16],
      containerPadding: [0, 0],
    });
    expect(props.dragConfig).toMatchObject({ enabled: false, bounded: true });
    expect(props.resizeConfig).toMatchObject({ enabled: true, handles: ['se', 'e'] });
  });

  it('compactType 映射 compactor，未指定时不传（走 RGL 默认）', () => {
    render(<GridLayout dslChildren={dslChildren} compactType="horizontal" />);
    expect(lastRglProps().compactor).toEqual({ name: 'horizontal' });
    render(<GridLayout dslChildren={dslChildren} compactType="none" />);
    expect(lastRglProps().compactor).toEqual({ name: 'none' });
    render(<GridLayout dslChildren={dslChildren} />);
    expect(lastRglProps().compactor).toBeUndefined();
  });

  it('onLayoutChange 事件载荷携带可变副本 { layout }', () => {
    const onLayoutChange = vi.fn();
    render(<GridLayout dslChildren={dslChildren} onLayoutChange={onLayoutChange} />);
    const next = Object.freeze([Object.freeze({ i: 'kpi-1', x: 0, y: 0, w: 4, h: 2 })]);
    lastRglProps().onLayoutChange(next);
    const event = onLayoutChange.mock.calls[0][0];
    expect(event.layout).toEqual([{ i: 'kpi-1', x: 0, y: 0, w: 4, h: 2 }]);
    expect(Object.isFrozen(event.layout)).toBe(false);
    expect(Object.isFrozen(event.layout[0])).toBe(false);
  });

  it('onDragStop 事件载荷携带 { layout, item, oldItem }', () => {
    const onDragStop = vi.fn();
    render(<GridLayout dslChildren={dslChildren} onDragStop={onDragStop} />);
    const layout = [{ i: 'kpi-1', x: 1, y: 0, w: 4, h: 2 }];
    const oldItem = { i: 'kpi-1', x: 0, y: 0, w: 4, h: 2 };
    const newItem = { i: 'kpi-1', x: 1, y: 0, w: 4, h: 2 };
    lastRglProps().onDragStop(layout, oldItem, newItem, null, {}, null);
    expect(onDragStop.mock.calls[0][0]).toEqual({ layout, item: newItem, oldItem });
  });

  it('未挂事件时不向 RGL 传对应回调', () => {
    render(<GridLayout dslChildren={dslChildren} />);
    const props = lastRglProps();
    expect(props.onLayoutChange).toBeUndefined();
    expect(props.onDragStop).toBeUndefined();
    expect(props.onResizeStop).toBeUndefined();
  });

  it('SSR 守卫：宽度未测量完成时不挂载 RGL', () => {
    containerWidth.width = 0;
    containerWidth.mounted = false;
    render(<GridLayout dslChildren={dslChildren} />);
    expect(rglSpy).not.toHaveBeenCalled();
    expect(document.querySelector('[data-slot="grid-layout"]')).not.toBeNull();
    containerWidth.width = 1200;
    containerWidth.mounted = true;
  });
});

describe('GridLayout（纯 React 路径）', () => {
  it('children 原样下传，layout 需由宿主按 child key 提供', () => {
    render(
      <GridLayout layout={[{ i: 'a', x: 0, y: 0, w: 4, h: 2 }]}>
        <div key="a">面板</div>
      </GridLayout>,
    );
    const props = lastRglProps();
    expect(props.layout).toEqual([{ i: 'a', x: 0, y: 0, w: 4, h: 2 }]);
    expect(props.children).toBeTruthy();
  });
});

describe('registry 注册', () => {
  it('createGridLayoutComponentRegistry 以 withScope 注册 DSL 类型名 GridLayout', () => {
    const registry = createGridLayoutComponentRegistry();
    const entry = registry.get('GridLayout') as { component: unknown; withScope?: boolean };
    expect(entry.component).toBe(GridLayout);
    expect(entry.withScope).toBe(true);
  });
});
