import type { DslNode, PermissionDeniedStrategy } from 'pactor-core';
import {
  resolveTemplate,
  type ExpressionScope,
} from 'pactor-expression';
import {
  createElement,
  useMemo,
  useSyncExternalStore,
  type ComponentType,
  type Key,
  type ReactNode,
} from 'react';

import { ActionEngine } from '../action/engine.js';
import type { RuntimeContext } from '../context/context.js';
import { buildScope } from '../context/scope.js';
import { resolveDeep } from '../utils/resolve.js';
import {
  RendererContextProvider,
  type RendererContextValue,
} from './renderer-context.js';
import { UnsupportedComponent } from './unsupported.js';

// eslint 未配置，这里仅用 any 承接 Registry<unknown> 取出的组件条目
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/**
 * 组件注册条目：直接注册组件，或以 `{ component, withScope: true }`
 * 声明组件自行渲染 children（经 `useRenderer().renderChildren`
 * 注入行 / 项等局部作用域，此时原始 DSL children 以 `dslChildren` prop 传入）。
 */
export interface ScopedComponentEntry {
  component: AnyComponent;
  withScope?: boolean;
}

export type ComponentEntry = AnyComponent | ScopedComponentEntry;

export interface DslRendererProps {
  context: RuntimeContext;
  node?: DslNode;
  engine?: ActionEngine;
  /**
   * 附加子树（最小补充）：渲染在 RendererContextProvider 之内、
   * DSL 根节点之后，供 OverlayHost 等宿主把扩展 UI 挂进
   * Renderer 上下文（children 内可 `useRenderer()`）。
   */
  children?: ReactNode;
}

/**
 * React Renderer（设计文档第 21 节，决策 D5）。
 *
 * 函数式递归渲染：组件一律经 ComponentRegistry 解析（禁止按类型名
 * 硬编码分支）；props 深度表达式解析；`when` 条件渲染；`events`
 * 绑定到 Action 引擎；`permission` 经 PermissionAdapter 检查，
 * 无权限时按 denied 策略处理（hidden 不渲染 / 注入 disabled /
 * 注入 readOnly）。V1 简化策略：根节点订阅整个 StateStore /
 * DataStore，任一变化重渲染整棵 DSL 树。
 */
export function DslRenderer({ context, node, engine, children }: DslRendererProps) {
  useSyncExternalStore(
    (onChange) => {
      const offState = context.state.subscribe(onChange);
      const offData = context.data.subscribe(onChange);
      return () => {
        offState();
        offData();
      };
    },
    () => `${context.state.getVersion()}:${context.data.getVersion()}`,
  );

  const resolvedEngine = useMemo(
    () => engine ?? new ActionEngine(context),
    [engine, context],
  );

  const value = useMemo<RendererContextValue>(() => {
    const root: RendererContextValue = {
      context,
      engine: resolvedEngine,
      scope: {},
      renderChildren: (children, extraScope) =>
        renderChildrenOf(root, children, extraScope),
    };
    return root;
  }, [context, resolvedEngine]);

  return (
    <RendererContextProvider value={value}>
      {node ? renderNode(node, value, node.id ?? 'root') : null}
      {children}
    </RendererContextProvider>
  );
}

function renderNode(
  node: DslNode,
  value: RendererContextValue,
  key: Key,
): ReactNode {
  const scope = buildScope(value.context, value.scope);

  if (node.when !== undefined) {
    const expression =
      typeof node.when === 'string' ? node.when : node.when.expression;
    let visible: unknown;
    try {
      visible = resolveTemplate(expression, scope);
    } catch (cause) {
      // 表达式错误不击穿渲染层：视为不渲染并告警
      console.warn(
        `[pactor-runtime] when 表达式求值失败（节点 "${node.type}"）`,
        cause,
      );
      visible = false;
    }
    if (!visible) {
      return null;
    }
  }

  // 权限检查（设计文档第 41 节）：无权限时按 denied 策略处理——
  // hidden 不渲染；disabled / readonly 在 props 解析后注入对应 prop
  let deniedStrategy: PermissionDeniedStrategy | undefined;
  if (
    node.permission !== undefined &&
    !value.context.permission.check(node.permission)
  ) {
    deniedStrategy = resolveDeniedStrategy(node.permission);
    if (deniedStrategy === 'hidden') {
      return null;
    }
  }

  const entry = value.context.components.get(node.type) as
    | ComponentEntry
    | undefined;
  const normalized = normalizeEntry(entry);
  if (!normalized) {
    return <UnsupportedComponent key={key} type={node.type} />;
  }

  const props = resolveProps(node.props, scope);

  // events 绑定：事件对象放入 event 局部作用域，动作数组串行执行
  if (node.events) {
    for (const [name, actions] of Object.entries(node.events)) {
      props[name] = (event: unknown) => {
        void value.engine.executeAll(actions, { ...value.scope, event });
      };
    }
  }

  // 权限注入优先于 DSL props 同名字段，放在 events 绑定之后
  if (deniedStrategy === 'disabled') {
    props['disabled'] = true;
  } else if (deniedStrategy === 'readonly') {
    props['readOnly'] = true;
  }

  if (normalized.withScope) {
    return createElement(normalized.component, {
      key,
      ...props,
      dslChildren: node.children,
    });
  }
  return createElement(
    normalized.component,
    { key, ...props },
    renderChildrenOf(value, node.children),
  );
}

/** 从 PermissionConfig 提取 denied 策略：仅对象形式可指定，缺省 hidden */
function resolveDeniedStrategy(
  permission: NonNullable<DslNode['permission']>,
): PermissionDeniedStrategy {
  if (typeof permission === 'object' && !Array.isArray(permission)) {
    return permission.denied ?? 'hidden';
  }
  return 'hidden';
}

function renderChildrenOf(
  value: RendererContextValue,
  children: DslNode[] | undefined,
  extraScope?: ExpressionScope,
): ReactNode {
  if (!children || children.length === 0) {
    return null;
  }
  if (!extraScope) {
    return children.map((child, index) =>
      renderNode(child, value, child.id ?? index),
    );
  }
  // 注入局部作用域：新建 scoped value 并经 Provider 传递给子树
  const scoped: RendererContextValue = {
    context: value.context,
    engine: value.engine,
    scope: { ...value.scope, ...extraScope },
    renderChildren: (nested, nestedScope) =>
      renderChildrenOf(scoped, nested, nestedScope),
  };
  return (
    <RendererContextProvider value={scoped}>
      {children.map((child, index) =>
        renderNode(child, scoped, child.id ?? index),
      )}
    </RendererContextProvider>
  );
}

function normalizeEntry(
  entry: ComponentEntry | undefined,
): ScopedComponentEntry | undefined {
  if (!entry) {
    return undefined;
  }
  if (typeof entry === 'object' && 'component' in entry) {
    return entry;
  }
  return { component: entry as AnyComponent };
}

/**
 * props 深度表达式解析（决策 D5）：
 * 字符串经模板求值（`hasExpression` 快速路径在 `resolveDeep` 内），
 * 数组 / 对象递归；key 为 `on*` 且值是字符串时原样保留
 * （DSL 事件统一走 `events` 字段，props 里的 `on*` 留给组件内部约定）。
 *
 * 内嵌 DslNode 子树（带 `type` 字段的普通对象，如 Table `columns[].cell`、
 * Tabs `items[].children[]`）不在父作用域求值、原样保留——它们随后经
 * `renderChildren` 以组件注入的局部作用域（row / rowIndex 等）渲染，
 * 提前求值会把 `${row.x}` 解析为 undefined。
 */
function resolveProps(
  props: Record<string, unknown> | undefined,
  scope: ExpressionScope,
): Record<string, unknown> {
  if (!props) {
    return {};
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    out[key] =
      typeof value === 'string' && key.startsWith('on')
        ? value
        : resolveDeep(value, scope, { isOpaque: isEmbeddedDslNode });
  }
  return out;
}

/** 判断普通对象是否为内嵌 DslNode（有字符串 `type` 字段即视为 DSL 节点） */
function isEmbeddedDslNode(value: Record<string, unknown>): boolean {
  return typeof value.type === 'string';
}
