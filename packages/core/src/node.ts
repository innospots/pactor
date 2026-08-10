/**
 * DSL 核心节点（设计文档第 11 节）。
 */

/** 受控表达式字符串，如 "${state.count}" */
export type ExpressionString = string;

/** 条件配置：表达式字符串，或显式对象形式 */
export type ConditionConfig = ExpressionString | { expression: ExpressionString };

/** 权限配置：权限码或权限码数组（任一命中即可，由权限运行时解释） */
export type PermissionConfig = string | string[];

/** 动作配置（设计文档第 17 节） */
export interface ActionConfig {
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

/** UI DSL 树基础节点 */
export interface DslNode {
  id?: string;
  /** 组件类型，对应 Component Registry 中的注册名 */
  type: string;
  props?: Record<string, unknown>;
  children?: DslNode[];
  events?: EventMap;
  permission?: PermissionConfig;
  /** 条件渲染 */
  when?: ConditionConfig;
}
