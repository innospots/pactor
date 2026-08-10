import type { ActionConfig, DslNode, PermissionConfig } from './node.js';

/**
 * DSL 文档结构（设计文档第 9、10、37 节）。
 */

/** DSL Specification Version 字符串，如 "1.0" */
export type DslVersion = string;

/** 能力声明：DSL 对 Runtime / 组件版本的要求（第 37 节） */
export interface RequiresConfig {
  /** Runtime 版本范围（semver range），如 ">=1.0.0" */
  runtime?: string;
  /** 组件 API 版本要求：组件名 → semver range */
  components?: Record<string, string>;
}

/** 页面元信息 */
export interface PageMeta {
  id: string;
  title?: string;
  /** 页面类型 / Page Pattern，如 "list"、"detail"、"form" */
  type?: string;
  permission?: PermissionConfig;
}

/** DataSource 类型（第 19 节） */
export type DataSourceType = 'http' | 'service' | 'static' | 'computed' | 'resource';

/** DataSource 配置 */
export interface DataSourceConfig {
  type: DataSourceType;
  /** type 为 service 时的服务名，如 "customer.list" */
  service?: string;
  autoLoad?: boolean;
  /** 调用参数，值可含表达式字符串 */
  params?: Record<string, unknown>;
  /** type 为 http 时的请求描述 */
  request?: {
    method?: string;
    url: string;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    body?: unknown;
  };
  /** 分页参数映射，值可含表达式字符串 */
  pagination?: {
    page?: unknown;
    pageSize?: unknown;
  };
  /** type 为 static 时的静态数据 */
  value?: unknown;
}

/** 业务语义生命周期事件名（第 20 节） */
export type LifecycleEventName =
  | 'onInit'
  | 'onLoad'
  | 'onReady'
  | 'onShow'
  | 'onHide'
  | 'onDestroy';

/** 生命周期配置：事件名 → 单个或多个动作 */
export type LifecycleConfig = Partial<
  Record<LifecycleEventName, ActionConfig | ActionConfig[]>
>;

/** Page DSL 根结构（第 10 节） */
export interface PageDsl {
  /** DSL Specification Version，必填 */
  dsl: DslVersion;
  requires?: RequiresConfig;
  page: PageMeta;
  /** 页面初始状态 */
  state?: Record<string, unknown>;
  dataSources?: Record<string, DataSourceConfig>;
  lifecycle?: LifecycleConfig;
  /** UI 树根 */
  body?: DslNode;
}

/** Fragment DSL（第 50 节）：可复用的 UI 片段 */
export interface FragmentDsl {
  dsl: DslVersion;
  requires?: RequiresConfig;
  fragment: {
    id: string;
    title?: string;
  };
  body: DslNode;
}

/** Application DSL（第 9.1 节） */
export interface ApplicationDsl {
  dsl: DslVersion;
  requires?: RequiresConfig;
  application: {
    id: string;
    layout?: {
      type: string;
    };
    theme?: {
      name: string;
    };
    navigation?: {
      mode: string;
    };
  };
}
