import { useMemo, type CSSProperties, type ReactNode, type Ref } from 'react';

import { isDslSourceRef, type DslChildren, type DslChildrenItem } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import ReactGridLayout, {
  horizontalCompactor,
  noCompactor,
  useContainerWidth,
  verticalCompactor,
  type Compactor,
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
} from 'react-grid-layout';

/** DSL 侧声明的单个布局项（与 react-grid-layout LayoutItem 同构） */
export type GridLayoutItemSpec = Omit<LayoutItem, 'constraints' | 'moved'>;

/** onLayoutChange 的事件载荷：DSL 侧经 ${event.layout} 读取 */
export interface GridLayoutChangeEvent {
  layout: GridLayoutItemSpec[];
}

/** 拖拽 / 缩放事件载荷：${event.item} 为操作后的布局项，${event.oldItem} 为操作前 */
export interface GridLayoutItemEvent extends GridLayoutChangeEvent {
  item: GridLayoutItemSpec | null;
  oldItem: GridLayoutItemSpec | null;
}

export interface GridLayoutProps {
  /**
   * 布局数组：每项以 `i` 关联 children 的 `props.gridId`（或节点 id / 下标）。
   * 可经表达式绑定 state（如 ${state.dashboardLayout}），配合 onLayoutChange
   * 事件 + request action 实现布局服务端持久化。未提供布局项的 child
   * 自动按整行宽、默认高度追加在末尾。
   */
  layout?: GridLayoutItemSpec[];
  /** 栅格列数，缺省 12 */
  cols?: number;
  /** 单行高度（px），缺省 80 */
  rowHeight?: number;
  /** 格子间距 [水平, 垂直]（px），缺省 [16, 16] */
  margin?: [number, number];
  /** 容器内边距 [水平, 垂直]（px），缺省 [0, 0]（react-grid-layout 缺省与 margin 相同） */
  containerPadding?: [number, number] | null;
  /** 最大行数 */
  maxRows?: number;
  /** 是否可拖拽，缺省 true */
  draggable?: boolean;
  /** 拖拽手柄的 CSS 选择器（如 '.drag-handle'），设置后仅手柄可发起拖拽 */
  dragHandle?: string;
  /** 不触发拖拽的 CSS 选择器（如 'input, button'） */
  dragCancel?: string;
  /** 拖拽是否限制在容器内，缺省 false */
  bounded?: boolean;
  /** 是否可缩放，缺省 true */
  resizable?: boolean;
  /** 缩放把手方向，缺省 ['se'] */
  resizeHandles?: ResizeHandleAxis[];
  /** 压实方向：vertical（缺省）| horizontal | none（自由摆放，可重叠） */
  compactType?: 'vertical' | 'horizontal' | 'none';
  /** 容器高度是否随内容自适应，缺省 true */
  autoSize?: boolean;
  /** 布局变化（拖拽 / 缩放结束后）：event 携带 { layout } */
  onLayoutChange?: (event: GridLayoutChangeEvent) => void;
  onDragStart?: (event: GridLayoutItemEvent) => void;
  onDragStop?: (event: GridLayoutItemEvent) => void;
  onResizeStart?: (event: GridLayoutItemEvent) => void;
  onResizeStop?: (event: GridLayoutItemEvent) => void;
  /** 通用：容器 class */
  className?: string;
  /** 通用：容器内联样式 */
  style?: CSSProperties;
  /** 纯 React 宿主直接传 ReactNode（child 的 key 即格子 id，需与 layout 项的 i 对应） */
  children?: ReactNode;
  /** withScope 注入：原始 DSL children，不对外声明 */
  dslChildren?: DslChildren;
}

/** 未声明布局项的 child 的默认行高（栅格单位） */
const DEFAULT_ITEM_H = 4;

/** child 的格子 id：props.gridId（原始 DSL props，静态字符串）> node.id > 下标 */
function gridIdOf(child: DslChildrenItem, index: number): string {
  if (!isDslSourceRef(child)) {
    const gridId = child.props?.['gridId'];
    if (typeof gridId === 'string' && gridId) {
      return gridId;
    }
    if (child.id) {
      return child.id;
    }
  }
  return String(index);
}

/** 按 children 顺序构建完整布局：声明项优先，缺失项整行追加在已声明布局的底部 */
export function buildGridLayout(
  keys: string[],
  layout: GridLayoutItemSpec[] | undefined,
  cols: number,
): GridLayoutItemSpec[] {
  const byId = new Map((layout ?? []).map((item) => [item.i, item]));
  let nextY = (layout ?? []).reduce((acc, item) => Math.max(acc, item.y + item.h), 0);
  return keys.map((key) => {
    const spec = byId.get(key);
    if (spec) {
      return { ...spec, i: key };
    }
    const item = { i: key, x: 0, y: nextY, w: cols, h: DEFAULT_ITEM_H };
    nextY += DEFAULT_ITEM_H;
    return item;
  });
}

function compactorOf(compactType: GridLayoutProps['compactType']): Compactor | undefined {
  if (compactType === 'horizontal') {
    return horizontalCompactor;
  }
  if (compactType === 'none') {
    return noCompactor;
  }
  if (compactType === 'vertical') {
    return verticalCompactor;
  }
  return undefined;
}

/** 布局数组拷成可变副本（react-grid-layout v2 回调参数为只读） */
function toSpecList(layout: Layout): GridLayoutItemSpec[] {
  return layout.map((item) => ({ ...item }));
}

type ItemCallback = (
  layout: Layout,
  oldItem: LayoutItem | null,
  newItem: LayoutItem | null,
  placeholder: LayoutItem | null,
  event: Event,
  element: HTMLElement | null,
) => void;

function wrapItemCallback(
  handler: ((event: GridLayoutItemEvent) => void) | undefined,
): ItemCallback | undefined {
  if (!handler) {
    return undefined;
  }
  return (nextLayout, oldItem, newItem) =>
    handler({
      layout: toSpecList(nextLayout),
      item: newItem ? { ...newItem } : null,
      oldItem: oldItem ? { ...oldItem } : null,
    });
}

interface GridLayoutViewProps extends GridLayoutProps {
  width: number;
  containerRef: Ref<HTMLDivElement>;
  mounted: boolean;
  /** 已按格子 id 包好 key 的格子节点 */
  items: ReactNode;
  /** 构建完成的完整布局（含自动补全项） */
  resolvedLayout: GridLayoutItemSpec[];
}

/** 纯渲染层：RGL 挂载与 props 映射（SSR 下仅渲染空容器，mounted 后才初始化 RGL） */
function GridLayoutView({
  width,
  containerRef,
  mounted,
  items,
  resolvedLayout,
  cols = 12,
  rowHeight = 80,
  margin,
  containerPadding,
  maxRows,
  draggable = true,
  dragHandle,
  dragCancel,
  bounded = false,
  resizable = true,
  resizeHandles,
  compactType,
  autoSize = true,
  onLayoutChange,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  className,
  style,
}: GridLayoutViewProps) {
  return (
    <div ref={containerRef} data-slot="grid-layout" className={className} style={style}>
      {mounted && width > 0 ? (
        <ReactGridLayout
          width={width}
          layout={resolvedLayout as Layout}
          gridConfig={{
            cols,
            rowHeight,
            margin: margin ?? [16, 16],
            containerPadding: containerPadding === undefined ? [0, 0] : containerPadding,
            maxRows: maxRows ?? Number.POSITIVE_INFINITY,
          }}
          dragConfig={{ enabled: draggable, handle: dragHandle, cancel: dragCancel, bounded }}
          resizeConfig={{ enabled: resizable, handles: resizeHandles ?? ['se'] }}
          compactor={compactorOf(compactType)}
          autoSize={autoSize}
          onLayoutChange={
            onLayoutChange ? (next) => onLayoutChange({ layout: toSpecList(next) }) : undefined
          }
          onDragStart={wrapItemCallback(onDragStart)}
          onDragStop={wrapItemCallback(onDragStop)}
          onResizeStart={wrapItemCallback(onResizeStart)}
          onResizeStop={wrapItemCallback(onResizeStop)}
        >
          {items}
        </ReactGridLayout>
      ) : null}
    </div>
  );
}

/**
 * DSL 路径：原始 children 逐项包一层带 key 的格子容器（RGL 要求直接子节点
 * 带与 layout 项 i 对应的 key），再交给视图层。
 */
function DslGridLayout(props: GridLayoutProps & { dslChildren: DslChildren }) {
  const { dslChildren, cols = 12, layout } = props;
  const { width, containerRef, mounted } = useContainerWidth();
  const { renderChildren } = useRenderer();

  const childList = useMemo<DslChildrenItem[]>(
    () => (Array.isArray(dslChildren) ? dslChildren : [dslChildren]),
    [dslChildren],
  );
  const keys = childList.map((child, index) => gridIdOf(child, index));
  const resolvedLayout = buildGridLayout(keys, layout, cols);
  const items = childList.map((child, index) => (
    <div key={keys[index]} data-slot="grid-layout-item">
      {renderChildren([child])}
    </div>
  ));

  return (
    <GridLayoutView
      {...props}
      width={width}
      containerRef={containerRef}
      mounted={mounted}
      items={items}
      resolvedLayout={resolvedLayout}
    />
  );
}

/**
 * 可拖拽 / 可缩放的栅格仪表盘容器（DSL 类型名 GridLayout），
 * 底层为 react-grid-layout v2。以 withScope 注册——原始 DSL children
 * 经 dslChildren 传入；格子 id 取 child 的 props.gridId
 * （缺省节点 id / 下标），与 layout 项的 i 对应。
 * 纯 React 宿主可直接传 children（child 的 key 即格子 id）。
 */
export function GridLayout(props: GridLayoutProps) {
  if (props.dslChildren !== undefined) {
    return <DslGridLayout {...props} dslChildren={props.dslChildren} />;
  }
  const { width, containerRef, mounted } = useContainerWidth();
  return (
    <GridLayoutView
      {...props}
      width={width}
      containerRef={containerRef}
      mounted={mounted}
      items={props.children}
      resolvedLayout={props.layout ?? []}
    />
  );
}
