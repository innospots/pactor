/**
 * DSL 核心节点（设计文档第 11 节）。
 */

/** 受控表达式字符串，如 "${state.count}" */
export type ExpressionString = string;

/** 条件配置：表达式字符串，或显式对象形式 */
export type ConditionConfig = ExpressionString | { expression: ExpressionString };

/** 无权限时的组件处理策略（设计文档第 41 节） */
export type PermissionDeniedStrategy = 'hidden' | 'disabled' | 'readonly';

/**
 * 权限配置：权限码或权限码数组（任一命中即可，由权限运行时解释），
 * 或对象形式（`code` 判定权限，`denied` 指定无权限时的组件处理策略，
 * 缺省为 `'hidden'`）
 */
export type PermissionConfig =
  | string
  | string[]
  | { code: string | string[]; denied?: PermissionDeniedStrategy };

/** 动作配置（设计文档第 17 节） */
export interface ActionConfig {
  /**
   * 命名动作 id（设计文档第 48 节）：声明后，动作执行结果写入
   * 表达式作用域 `actions.<id>`（成功时为结果数据，失败时为
   * `{ ok: false, error }`），供后续动作引用，如
   * `${actions.editResult.success}`；缺省时行为不变
   */
  id?: string;
  /** 动作名，对应 Action Registry 中的注册名，如 "navigate"、"risk.calculate" */
  action: string;
  /** 动作参数，值可含表达式字符串 */
  params?: Record<string, unknown>;
  /** 条件执行 */
  condition?: ConditionConfig;
  /** 执行权限 */
  permission?: PermissionConfig;
}

/** 事件映射：事件名 → 单个或多个动作 */
export type EventMap = Record<string, ActionConfig | ActionConfig[]>;

/**
 * 动态 DSL 引用（设计文档：DSL 各位置支持远端加载）：
 * `source` 为二选一形态——`service`（经 ServiceRegistry 调用）或
 * `http`（经 HttpAdapter 请求），返回 DSL 内容（PageDsl / DslNode / DslNode[]）；
 * `params` 值可含表达式字符串，按**首次解析时**的作用域求值一次（不做联动重载）。
 * `placeholder` 为解析期间渲染的占位子树（缺省渲染空）。
 */
export interface DslSourceRef {
  source:
    | {
        type: 'service';
        service: string;
        params?: Record<string, unknown>;
      }
    | {
        type: 'http';
        request: {
          method?: string;
          url: string;
          params?: Record<string, unknown>;
          headers?: Record<string, string>;
        };
      };
  placeholder?: DslNode;
}

/** DslSourceRef 类型守卫 */
export function isDslSourceRef(value: unknown): value is DslSourceRef {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const source = (value as { source?: unknown }).source;
  return (
    typeof source === 'object' &&
    source !== null &&
    ((source as { type?: unknown }).type === 'service' ||
      (source as { type?: unknown }).type === 'http')
  );
}

/** 子树元素：内联节点或动态引用（children 数组中可混排） */
export type DslChildrenItem = DslNode | DslSourceRef;

/** 子树声明：内联数组（元素可为节点或动态引用混排），或整体远端动态引用 */
export type DslChildren = DslChildrenItem[] | DslSourceRef;

/** UI DSL 树基础节点共有字段 */
export interface DslNodeBase {
  id?: string;
  props?: Record<string, unknown>;
  children?: DslChildren;
  events?: EventMap;
  permission?: PermissionConfig;
  /** 条件渲染 */
  when?: ConditionConfig;
}

/** 组件节点：`type` 对应 Component Registry 中的注册名 */
export interface DslComponentNode extends DslNodeBase {
  type: string;
  component?: undefined;
}

/**
 * 引用节点：`component` 引用页面级命名组件（PageDsl.components）的 key，
 * 渲染该子树；引用处的 props / events 覆盖定义处同名字段
 */
export interface DslReferenceNode extends DslNodeBase {
  component: string;
  type?: undefined;
}

/** UI DSL 树节点：组件节点（type）与引用节点（component）二选一 */
export type DslNode = DslComponentNode | DslReferenceNode;
