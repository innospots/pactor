import { useEffect, useRef, type CSSProperties } from 'react';

import {
  CanvasEvent,
  EdgeEvent,
  Graph as G6Graph,
  GraphEvent,
  NodeEvent,
  type GraphData,
  type GraphOptions,
} from '@antv/g6';

/** DSL 侧图数据（与 G6 v5 GraphData 同构，声明保持引擎无关） */
export interface GraphNodeSpec {
  id: string;
  /** 所属组合 id */
  combo?: string;
  /** 业务数据，tooltip / 事件载荷中经 data 读取 */
  data?: Record<string, unknown>;
  /** 节点样式（fill / size / labelText 等，同 G6 node style） */
  style?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GraphEdgeSpec {
  source: string;
  target: string;
  id?: string;
  data?: Record<string, unknown>;
  style?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GraphComboSpec {
  id: string;
  combo?: string;
  data?: Record<string, unknown>;
  style?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GraphDataSpec {
  nodes?: GraphNodeSpec[];
  edges?: GraphEdgeSpec[];
  combos?: GraphComboSpec[];
}

/** onNodeClick / onNodeDragEnd 载荷：DSL 侧经 ${event.node.id} / ${event.node.data} 读取 */
export interface GraphNodeEventPayload {
  node: { id: string; data?: Record<string, unknown> };
}

/** onEdgeClick 载荷：${event.edge.id} / ${event.edge.source} / ${event.edge.target} */
export interface GraphEdgeEventPayload {
  edge: { id: string; source?: string; target?: string; data?: Record<string, unknown> };
}

/** onCanvasClick 载荷：${event.canvas.x} / ${event.canvas.y}（画布坐标） */
export interface GraphCanvasEventPayload {
  canvas: { x: number; y: number };
}

/** 插件开关表：true 用缺省配置开启，对象展开进插件配置，false / 缺省关闭 */
export type GraphPluginSwitches = Record<string, boolean | Record<string, unknown>>;

export interface GraphProps {
  /**
   * 图数据 { nodes, edges, combos }，可经表达式绑定 state / dataSource
   * （如 ${state.graphData} / ${ds.graph.result}）。变化时走 setData + draw 增量更新。
   */
  data?: GraphDataSpec;
  /**
   * 布局：字符串简写（'dagre' | 'force' | 'd3-force' | 'grid' | 'circular' | 'radial' |
   * 'concentric' | 'mindmap' | 'indented' | 'combo-combined' …，缺省 'force'），
   * 或完整 G6 layout 配置对象。
   */
  layout?: string | Record<string, unknown>;
  /** layout 为字符串时的附加布局参数（如 { rankdir: 'LR', nodesep: 24 }） */
  layoutOptions?: Record<string, unknown>;
  /** 全局节点样式（同 G6 node.style），数据项上的 style 优先 */
  nodeStyle?: Record<string, unknown>;
  /** 全局边样式（同 G6 edge.style） */
  edgeStyle?: Record<string, unknown>;
  /** 全局组合样式（同 G6 combo.style） */
  comboStyle?: Record<string, unknown>;
  /** 节点调色板（同 G6 node.palette，如 { type: 'group', field: 'group' }） */
  palette?: Record<string, unknown>;
  /**
   * 交互行为数组（G6 behaviors），字符串或配置对象，
   * 缺省 ['zoom-canvas', 'drag-canvas', 'drag-element', 'click-select']
   */
  behaviors?: Array<string | Record<string, unknown>>;
  /** 插件开关：{ tooltip: true, minimap: true, toolbar: { position: 'right-top' } }，缺省 { tooltip: true } */
  plugins?: GraphPluginSwitches;
  /** 渲染后自适应：view（缺省，缩放适配容器）| center（仅居中）| false（不自适应） */
  autoFit?: 'view' | 'center' | false;
  /** 主题：light（缺省）| dark */
  theme?: 'light' | 'dark';
  /** 画布背景色 */
  background?: string;
  /** 容器高度（px），缺省 400；宽度随容器自适应 */
  height?: number;
  onNodeClick?: (event: GraphNodeEventPayload) => void;
  onNodeDragEnd?: (event: GraphNodeEventPayload) => void;
  onEdgeClick?: (event: GraphEdgeEventPayload) => void;
  onCanvasClick?: (event: GraphCanvasEventPayload) => void;
  onAfterRender?: () => void;
  /** 通用：容器 class */
  className?: string;
  /** 通用：容器内联样式 */
  style?: CSSProperties;
}

const DEFAULT_BEHAVIORS = ['zoom-canvas', 'drag-canvas', 'drag-element', 'click-select'];

/** 缺省节点标签：datum.data.label，回退节点 id */
function defaultLabelText(datum: { id?: string; data?: Record<string, unknown> }): string {
  const label = datum.data?.['label'];
  return typeof label === 'string' && label ? label : String(datum.id ?? '');
}

/** props → G6 GraphOptions（不含 data / container，纯函数便于测试） */
export function buildGraphOptions(
  props: Pick<
    GraphProps,
    | 'layout'
    | 'layoutOptions'
    | 'nodeStyle'
    | 'edgeStyle'
    | 'comboStyle'
    | 'palette'
    | 'behaviors'
    | 'plugins'
    | 'autoFit'
    | 'theme'
    | 'background'
  >,
): GraphOptions {
  const layout =
    typeof props.layout === 'string'
      ? { type: props.layout, ...props.layoutOptions }
      : (props.layout ?? { type: 'force', ...props.layoutOptions });
  const switches = props.plugins ?? { tooltip: true };
  const plugins = Object.entries(switches)
    .filter(([, value]) => value !== false && value !== undefined)
    .map(([type, value]) => (value === true ? { type } : { type, ...(value as object) }));
  // DSL 无法传函数：缺省 labelText 取 datum.data.label（回退 id），nodeStyle 显式配置可覆盖
  const nodeStyle = { labelText: defaultLabelText, ...props.nodeStyle };
  return {
    layout: layout as GraphOptions['layout'],
    node: { style: nodeStyle, palette: props.palette } as GraphOptions['node'],
    edge: { style: props.edgeStyle } as GraphOptions['edge'],
    combo: { style: props.comboStyle } as GraphOptions['combo'],
    behaviors: (props.behaviors ?? DEFAULT_BEHAVIORS) as GraphOptions['behaviors'],
    plugins: plugins as GraphOptions['plugins'],
    autoFit: props.autoFit === false ? undefined : (props.autoFit ?? 'view'),
    theme: props.theme,
    background: props.background,
  };
}

/** 补齐 data 缺省数组，避免 G6 收到 undefined 字段 */
export function normalizeGraphData(data: GraphDataSpec | undefined): GraphDataSpec {
  return { nodes: data?.nodes ?? [], edges: data?.edges ?? [], combos: data?.combos ?? [] };
}

interface ElementTarget {
  id?: string;
}

interface ElementEventLike {
  target?: ElementTarget;
  canvas?: { x?: number; y?: number };
}

type GraphHandlers = Pick<
  GraphProps,
  'onNodeClick' | 'onNodeDragEnd' | 'onEdgeClick' | 'onCanvasClick' | 'onAfterRender'
>;

/**
 * destroy 延时时长：须覆盖 G6 插件 debounce 的尾部触发窗口
 * （minimap 的 onRender 为 128ms debounce，由 render 落定后才发射的
 * AFTER_ANIMATE 等事件调度，destroy 前一次性 cancel 拦不住）
 */
const DESTROY_DELAY_MS = 200;

/**
 * G6 Minimap 等插件的 debounce/throttle 渲染在 graph.destroy() 后仍会触发
 * （G6 未在插件 destroy 时 cancel pending 定时器），异步访问已销毁实例报错。
 * 卸载前主动取消各插件 pending 的 onRender / onTransform。
 */
function cancelPendingPluginTimers(graph: G6Graph): void {
  try {
    // 不走 getPluginInstance（按 type 反查会打 warning），直接遍历插件控制器的实例表
    const controller = (
      graph as unknown as {
        context?: { plugin?: { extensionMap?: Record<string, unknown> } };
      }
    ).context?.plugin;
    for (const instance of Object.values(controller?.extensionMap ?? {})) {
      const timers = instance as {
        onRender?: { cancel?: () => void };
        onTransform?: { cancel?: () => void };
      };
      timers.onRender?.cancel?.();
      timers.onTransform?.cancel?.();
    }
  } catch {
    // 实例已销毁或 G6 内部结构变化时忽略
  }
}

/** 元素事件载荷：优先用图内 datum（拿业务 data），target.id 兜底 */
function bindGraphEvents(graph: G6Graph, handlersRef: { current: GraphHandlers }): void {
  graph.on(NodeEvent.CLICK, (raw: unknown) => {
    const event = raw as ElementEventLike;
    const handler = handlersRef.current.onNodeClick;
    const id = event.target?.id;
    if (!handler || !id) {
      return;
    }
    handler({ node: { id, data: graph.getNodeData(id)?.data } });
  });
  graph.on(NodeEvent.DRAG_END, (raw: unknown) => {
    const event = raw as ElementEventLike;
    const handler = handlersRef.current.onNodeDragEnd;
    const id = event.target?.id;
    if (!handler || !id) {
      return;
    }
    handler({ node: { id, data: graph.getNodeData(id)?.data } });
  });
  graph.on(EdgeEvent.CLICK, (raw: unknown) => {
    const event = raw as ElementEventLike;
    const handler = handlersRef.current.onEdgeClick;
    const id = event.target?.id;
    if (!handler || !id) {
      return;
    }
    const datum = graph.getEdgeData(id);
    handler({
      edge: { id, source: datum?.source, target: datum?.target, data: datum?.data },
    });
  });
  graph.on(CanvasEvent.CLICK, (raw: unknown) => {
    const event = raw as ElementEventLike;
    const handler = handlersRef.current.onCanvasClick;
    if (!handler) {
      return;
    }
    handler({ canvas: { x: event.canvas?.x ?? 0, y: event.canvas?.y ?? 0 } });
  });
  graph.on(GraphEvent.AFTER_RENDER, () => handlersRef.current.onAfterRender?.());
}

/**
 * 关系图 / 流程图组件（DSL 类型名 Graph），底层为 AntV G6 v5。
 * 纯客户端渲染：SSR 下仅输出空容器，挂载后实例化图；
 * spec（layout / behaviors / plugins …）变化重建实例，data 变化走增量更新。
 */
export function Graph(props: GraphProps) {
  const { data, height = 400, className, style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<G6Graph | null>(null);
  const handlersRef = useRef<GraphHandlers>({});
  handlersRef.current = {
    onNodeClick: props.onNodeClick,
    onNodeDragEnd: props.onNodeDragEnd,
    onEdgeClick: props.onEdgeClick,
    onCanvasClick: props.onCanvasClick,
    onAfterRender: props.onAfterRender,
  };

  // spec 与 data 以序列化 key 作变化检测：DSL 侧每次都是新对象引用。
  // 注意 options 可能含函数（缺省 labelText），实例化必须走 ref 里的原对象，不能 JSON.parse key
  const options = buildGraphOptions(props);
  const specKey = JSON.stringify(options);
  const normalized = normalizeGraphData(data);
  const dataKey = JSON.stringify(normalized);
  const appliedDataKeyRef = useRef<string | null>(null);
  const latestOptionsRef = useRef<GraphOptions>(options);
  latestOptionsRef.current = options;
  const latestDataRef = useRef<GraphDataSpec>(normalized);
  latestDataRef.current = normalized;

  // 挂载 + spec 变化：（重）建图实例并渲染
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const graph = new G6Graph({
      container,
      ...latestOptionsRef.current,
      data: latestDataRef.current as GraphOptions['data'],
    });
    graphRef.current = graph;
    appliedDataKeyRef.current = JSON.stringify(latestDataRef.current);
    bindGraphEvents(graph, handlersRef);
    // 渲染尚未完成就 destroy（如 StrictMode 双挂载）会让 G6 在内部继续渲染并报错，
    // 因此卸载时把 destroy 延后到 render 落定之后
    const ready = graph.render().catch(() => undefined);
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (!graphRef.current) {
              return;
            }
            try {
              graphRef.current.resize();
            } catch {
              // 容器零尺寸等瞬态下 resize 可能抛错，忽略
            }
          })
        : null;
    observer?.observe(container);
    return () => {
      observer?.disconnect();
      graphRef.current = null;
      void ready.finally(() => {
        cancelPendingPluginTimers(graph);
        // 延时 destroy：render 落定后仍有动画/事件会给插件调度新的 debounce，
        // 等过了插件 debounce 窗口再二次 cancel 并销毁（代价：spec 变化时新旧
        // 画布短暂重叠 ~200ms）
        setTimeout(() => {
          cancelPendingPluginTimers(graph);
          try {
            graph.destroy();
          } catch {
            // destroy 期间的瞬态错误忽略
          }
        }, DESTROY_DELAY_MS);
      });
    };
  }, [specKey]);

  // data 变化：实例存活期间增量更新（重建路径已由上条 effect 应用最新 data）
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || appliedDataKeyRef.current === dataKey) {
      return;
    }
    appliedDataKeyRef.current = dataKey;
    graph.setData(JSON.parse(dataKey) as GraphData);
    void graph.draw().catch(() => undefined);
  }, [dataKey, specKey]);

  return (
    <div
      ref={containerRef}
      data-slot="graph"
      className={className}
      style={{ width: '100%', height, ...style }}
    />
  );
}
