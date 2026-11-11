// @vitest-environment jsdom
/**
 * @pactor-app/graph 契约：
 * - buildGraphOptions：layout 字符串简写 + layoutOptions 合并，缺省 force；
 *   behaviors 缺省 zoom/drag/click-select 四件套；plugins 开关表（true 缺省配置、
 *   对象展开、false 关闭），缺省 { tooltip: true }；autoFit 缺省 'view'；
 * - 挂载即建图：container + spec + data 进构造器，render 异步触发，卸载 destroy；
 * - spec 变化重建实例，data 变化走 setData + draw 增量更新；
 * - 事件载荷：onNodeClick/onNodeDragEnd → { node: { id, data } }（data 取图内 datum），
 *   onEdgeClick → { edge: { id, source, target, data } }，onCanvasClick → { canvas: { x, y } }；
 * - ResizeObserver 触发 graph.resize（jsdom 无 ResizeObserver，以缺省路径覆盖）。
 * 底层 @antv/g6 以 mock 替身断言 options 透传与生命周期，不加载真实渲染链。
 */
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

interface MockGraphInstance {
  options: Record<string, any>;
  render: ReturnType<typeof vi.fn>;
  draw: ReturnType<typeof vi.fn>;
  setData: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  resize: ReturnType<typeof vi.fn>;
  getNodeData: ReturnType<typeof vi.fn>;
  getEdgeData: ReturnType<typeof vi.fn>;
  handlers: Map<string, (event: any) => void>;
  on: (event: string, handler: (event: any) => void) => void;
}

const instances: MockGraphInstance[] = [];

vi.mock('@antv/g6', () => {
  class MockGraph implements MockGraphInstance {
    options: Record<string, any>;
    handlers = new Map<string, (event: any) => void>();
    render = vi.fn(async () => undefined);
    draw = vi.fn(async () => undefined);
    setData = vi.fn();
    destroy = vi.fn();
    resize = vi.fn();
    getNodeData = vi.fn((id: string) => ({ id, data: { label: `node-${id}` } }));
    getEdgeData = vi.fn((id: string) => ({ id, source: 's', target: 't', data: { w: 1 } }));
    constructor(options: Record<string, any>) {
      this.options = options;
      instances.push(this);
    }
    on(event: string, handler: (event: any) => void) {
      this.handlers.set(event, handler);
    }
  }
  return {
    Graph: MockGraph,
    GraphEvent: { AFTER_RENDER: 'afterrender' },
    NodeEvent: { CLICK: 'node:click', DRAG_END: 'node:dragend' },
    EdgeEvent: { CLICK: 'edge:click' },
    CanvasEvent: { CLICK: 'canvas:click' },
  };
});

import { buildGraphOptions, createGraphComponentRegistry, Graph } from '../src/index.js';

afterEach(() => {
  cleanup();
  instances.length = 0;
});

function lastInstance(): MockGraphInstance {
  return instances[instances.length - 1]!;
}

const sampleData = {
  nodes: [{ id: 'a', data: { label: '甲' } }, { id: 'b' }],
  edges: [{ source: 'a', target: 'b' }],
};

describe('buildGraphOptions', () => {
  it('缺省：force 布局 + 四件套 behaviors + tooltip 插件 + autoFit view', () => {
    const options = buildGraphOptions({});
    expect(options.layout).toEqual({ type: 'force' });
    expect(options.behaviors).toEqual([
      'zoom-canvas',
      'drag-canvas',
      'drag-element',
      'click-select',
    ]);
    expect(options.plugins).toEqual([{ type: 'tooltip' }]);
    expect(options.autoFit).toBe('view');
  });

  it('layout 字符串简写与 layoutOptions 合并；对象原样透传', () => {
    expect(buildGraphOptions({ layout: 'dagre', layoutOptions: { rankdir: 'LR' } }).layout)
      .toEqual({ type: 'dagre', rankdir: 'LR' });
    expect(buildGraphOptions({ layout: { type: 'radial', unitRadius: 80 } }).layout)
      .toEqual({ type: 'radial', unitRadius: 80 });
  });

  it('plugins 开关表：true 缺省配置、对象展开、false 关闭', () => {
    const options = buildGraphOptions({
      plugins: { tooltip: true, minimap: false, toolbar: { position: 'right-top' } },
    });
    expect(options.plugins).toEqual([{ type: 'tooltip' }, { type: 'toolbar', position: 'right-top' }]);
  });

  it('nodeStyle / palette / theme / background 落位，autoFit false 关闭', () => {
    const options = buildGraphOptions({
      nodeStyle: { fill: '#f00' },
      palette: { type: 'group', field: 'group' },
      theme: 'dark',
      background: '#111',
      autoFit: false,
    });
    expect(options.node).toMatchObject({ style: { fill: '#f00' }, palette: { type: 'group' } });
    expect(options.theme).toBe('dark');
    expect(options.background).toBe('#111');
    expect(options.autoFit).toBeUndefined();
  });

  it('animation 透传：false 关闭元素动画，缺省不设置', () => {
    expect(buildGraphOptions({ animation: false }).animation).toBe(false);
    expect(buildGraphOptions({}).animation).toBeUndefined();
  });

  it('padding 透传：自适应时留出内边距，缺省不设置', () => {
    expect(buildGraphOptions({ padding: [24, 0, 64, 0] }).padding).toEqual([24, 0, 64, 0]);
    expect(buildGraphOptions({}).padding).toBeUndefined();
  });
});

describe('Graph 组件', () => {
  it('挂载即建图：container + spec + data 进构造器，render 触发', () => {
    const { container } = render(<Graph data={sampleData} layout="dagre" height={320} />);
    expect(instances.length).toBe(1);
    const graph = lastInstance();
    const slot = container.querySelector('[data-slot="graph"]') as HTMLElement;
    // 图实例挂在 slot 内独占的内部容器上，slot 自身只负责尺寸与定位
    expect((graph.options.container as HTMLElement).parentElement).toBe(slot);
    expect((graph.options.container as HTMLElement).style.position).toBe('absolute');
    expect(slot.style.height).toBe('320px');
    expect(slot.style.position).toBe('relative');
    expect(graph.options.layout).toEqual({ type: 'dagre' });
    expect(graph.options.data).toEqual({ ...sampleData, combos: [] });
    expect(graph.render).toHaveBeenCalledTimes(1);
  });

  it('data 缺省补齐空数组；卸载 destroy（render 落定 + 插件 debounce 窗口后）', async () => {
    const { unmount } = render(<Graph />);
    expect(lastInstance().options.data).toEqual({ nodes: [], edges: [], combos: [] });
    unmount();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(lastInstance().destroy).toHaveBeenCalledTimes(1);
  });

  it('data 变化走 setData + draw，不重建实例', async () => {
    const { rerender } = render(<Graph data={sampleData} />);
    const next = { nodes: [{ id: 'a' }, { id: 'c' }], edges: [] };
    await act(async () => {
      rerender(<Graph data={next} />);
    });
    expect(instances.length).toBe(1);
    expect(lastInstance().setData).toHaveBeenCalledWith({ ...next, combos: [] });
    expect(lastInstance().draw).toHaveBeenCalledTimes(1);
  });

  it('spec 变化重建实例并携带最新 data', async () => {
    const { rerender } = render(<Graph data={sampleData} layout="force" />);
    await act(async () => {
      rerender(<Graph data={sampleData} layout="grid" />);
    });
    // destroy 延后到 render 落定 + 插件 debounce 窗口（200ms）之后
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(instances.length).toBe(2);
    expect(instances[0]!.destroy).toHaveBeenCalledTimes(1);
    expect(lastInstance().options.layout).toEqual({ type: 'grid' });
    expect(lastInstance().options.data).toEqual({ ...sampleData, combos: [] });
    expect(lastInstance().setData).not.toHaveBeenCalled();
  });

  it('spec 变化时新旧实例各占独立内部容器，旧容器随销毁移除', async () => {
    const { rerender } = render(<Graph data={sampleData} layout="force" />);
    const firstHost = lastInstance().options.container as HTMLElement;
    await act(async () => {
      rerender(<Graph data={sampleData} layout="grid" />);
    });
    const secondHost = lastInstance().options.container as HTMLElement;
    expect(secondHost).not.toBe(firstHost);
    expect(secondHost.isConnected).toBe(true);
    expect(firstHost.style.pointerEvents).toBe('none');
    // 旧实例延时销毁后连同内部容器一起从文档移除，不会留着相机层干扰新实例
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(firstHost.isConnected).toBe(false);
    expect(secondHost.isConnected).toBe(true);
  });

  it('onNodeClick 载荷 { node: { id, data } }，data 取图内 datum', () => {
    const onNodeClick = vi.fn();
    render(<Graph data={sampleData} onNodeClick={onNodeClick} />);
    act(() => {
      lastInstance().handlers.get('node:click')!({ target: { id: 'a' } });
    });
    expect(onNodeClick).toHaveBeenCalledWith({ node: { id: 'a', data: { label: 'node-a' } } });
  });

  it('onEdgeClick / onCanvasClick / onNodeDragEnd / onAfterRender 载荷', () => {
    const onEdgeClick = vi.fn();
    const onCanvasClick = vi.fn();
    const onNodeDragEnd = vi.fn();
    const onAfterRender = vi.fn();
    render(
      <Graph
        data={sampleData}
        onEdgeClick={onEdgeClick}
        onCanvasClick={onCanvasClick}
        onNodeDragEnd={onNodeDragEnd}
        onAfterRender={onAfterRender}
      />,
    );
    const handlers = lastInstance().handlers;
    act(() => {
      handlers.get('edge:click')!({ target: { id: 'e1' } });
      handlers.get('canvas:click')!({ canvas: { x: 10, y: 20 } });
      handlers.get('node:dragend')!({ target: { id: 'b' } });
      handlers.get('afterrender')!({});
    });
    expect(onEdgeClick).toHaveBeenCalledWith({
      edge: { id: 'e1', source: 's', target: 't', data: { w: 1 } },
    });
    expect(onCanvasClick).toHaveBeenCalledWith({ canvas: { x: 10, y: 20 } });
    expect(onNodeDragEnd).toHaveBeenCalledWith({ node: { id: 'b', data: { label: 'node-b' } } });
    expect(onAfterRender).toHaveBeenCalledTimes(1);
  });

  it('未传 handler 时事件不抛错', () => {
    render(<Graph data={sampleData} />);
    act(() => {
      lastInstance().handlers.get('node:click')!({ target: { id: 'a' } });
      lastInstance().handlers.get('canvas:click')!({ canvas: { x: 0, y: 0 } });
    });
  });
});

describe('registry', () => {
  it('createGraphComponentRegistry 注册 DSL 类型名 Graph', () => {
    const registry = createGraphComponentRegistry();
    expect(registry.get('Graph')).toBe(Graph);
  });
});
