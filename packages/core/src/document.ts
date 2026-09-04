import type { ActionConfig, DslChildren, DslChildrenItem, DslNode, DslSourceRef, PermissionConfig } from './node.js';

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
  /** 页面名称（标识用途，区别于展示的 title） */
  name?: string;
  /** 页面描述 */
  description?: string;
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
  /**
   * 选项字段映射（该数据源用作选项源时声明）：加载结果为数组时，
   * 每项归一化出 `{ label, value, disabled }` 键（原字段保留），
   * 供 Select 等组件经 `${data.x}` 直接绑定
   */
  valueField?: string;
  labelField?: string;
  /** 选项禁用标记字段：数组项中该字段为真值时选项禁用 */
  disabledField?: string;
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
  /** 页面扩展元数据（自由键值，如 version / author / 业务自定义标记），Runtime 不消费，仅供宿主与工具链读取 */
  meta?: Record<string, unknown>;
  /** 页面初始状态 */
  state?: Record<string, unknown>;
  dataSources?: Record<string, DataSourceConfig>;
  /**
   * 页面级命名动作定义：动作名 → 单个动作或动作数组，
   * 供事件中的 `call` 动作按名引用复用（以调用方作用域执行，
   * `${row}` / `${event}` 等局部作用域原样可用）
   */
  actions?: Record<string, ActionConfig | ActionConfig[]>;
  /**
   * 页面级命名组件定义（设计文档第 50 节 Fragment 的页面局部形态）：
   * 组件名 → DslNode 子树（或 DslSourceRef 动态引用，引用处渲染时惰性解析），
   * body 中以 `{ component: '名称' }` 引用节点复用，防止 DSL 嵌套过深；
   * 以引用处作用域渲染
   */
  components?: Record<string, DslNode | DslSourceRef>;
  lifecycle?: LifecycleConfig;
  /**
   * UI 树根（单个 DslNode）。
   * 与根级 `children` 为两种等价声明形态：`body` 存在时优先使用 `body`；
   * `body` 缺失且 `children` 存在时以根级 `children` 作为 UI 树
   * （隐式片段根，无需 Page 等包装节点，DSL 可描述页面局部）；
   * 两者均缺失时按空树处理。读取入口见 `resolveRootNodes`
   */
  body?: DslNode;
  /**
   * UI 树根（`body` 缺失时生效）：数组形态（元素可为 DslNode 或
   * DslSourceRef 混排）或整体动态引用
   */
  children?: DslChildren;
}

/**
 * 读取 Page DSL 的 UI 树根元素列表（官方入口）：
 * `body` 存在 → `[body]`；根级 `children` 为数组 → 原样返回
 * （元素可为 DslNode 或 DslSourceRef）；根级 `children` 为整体
 * DslSourceRef 或缺失 → 空数组（整体引用形态由渲染入口经
 * DslSourceBoundary 异步解析）
 */
export function resolveRootNodes(pageDsl: PageDsl): DslChildrenItem[] {
  if (pageDsl.body) {
    return [pageDsl.body];
  }
  if (Array.isArray(pageDsl.children)) {
    return pageDsl.children;
  }
  return [];
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
