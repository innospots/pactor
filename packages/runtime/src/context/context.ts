import { Registry, type DataSourceConfig, type PageMeta } from 'pactor-core';
import type { ExpressionScope } from 'pactor-expression';

import type { ActionRegistry } from '../action/engine.js';
import { DataStore } from '../datasource/data-store.js';
import {
  createDefaultPermissionAdapter,
  createDefaultRouterAdapter,
  createFetchHttpAdapter,
  type HttpAdapter,
  type PermissionAdapter,
  type RouterAdapter,
} from './adapters.js';
import { buildScope } from './scope.js';
import { StateStore } from './state-store.js';

/** 业务服务函数：以求值后的 params 调用（如 `customer.list`） */
export type ServiceHandler = (
  params: Record<string, unknown>,
) => unknown | Promise<unknown>;

/** Service Registry：服务名 → 服务函数（设计文档第 18 节） */
export type ServiceRegistry = Registry<ServiceHandler>;

/**
 * Component Registry：组件类型名 → 组件条目。
 *
 * 条目在 renderer/ 中被作为 React 组件使用（可为组件或
 * `{ component, withScope }` 包装）；本层为保持零 React 依赖，
 * 类型放宽为 unknown，由注册方保证。
 */
export type ComponentRegistry = Registry<unknown>;

/** Capability Registry（设计文档第 37 节预留） */
export type CapabilityRegistry = Registry<unknown>;

/** 路由上下文：参数 + 导航能力（navigate 委托给 RouterAdapter） */
export interface RouteContext {
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  navigate(to: string): void;
}

/**
 * RuntimeContext（设计文档第 15 节，决策 D2）：
 * 普通 TS 对象，非 React 代码直接持有；Renderer 经 React Context 透传。
 */
export interface RuntimeContext {
  app: Record<string, unknown>;
  page: Partial<PageMeta>;
  state: StateStore;
  data: DataStore;
  route: RouteContext;
  user: Record<string, unknown>;
  services: ServiceRegistry;
  components: ComponentRegistry;
  actions: ActionRegistry;
  permission: PermissionAdapter;
  capabilities: CapabilityRegistry;
  /** HTTP 出口适配器（DataSource / request 动作共用） */
  http: HttpAdapter;
}

export interface CreateRuntimeContextOptions {
  app?: Record<string, unknown>;
  page?: Partial<PageMeta>;
  /** 页面初始 state */
  state?: Record<string, unknown>;
  dataSources?: Record<string, DataSourceConfig>;
  route?: {
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  };
  user?: Record<string, unknown>;
  services?: ServiceRegistry;
  components?: ComponentRegistry;
  actions?: ActionRegistry;
  permission?: PermissionAdapter;
  router?: RouterAdapter;
  http?: HttpAdapter;
  capabilities?: CapabilityRegistry;
}

/**
 * 组装 RuntimeContext。默认情形下 registries 为空 Registry 实例、
 * adapters 为默认空实现（permission 放行、navigate no-op、http 走 fetch）。
 *
 * 注意：本工厂不注册内置动作；`createPageRuntime` 会自动注册，
 * 独立使用上下文时可调用 `registerBuiltinActions(context.actions)`。
 */
export function createRuntimeContext(
  options: CreateRuntimeContextOptions = {},
): RuntimeContext {
  const state = new StateStore(options.state);
  const services =
    options.services ?? new Registry<ServiceHandler>('ServiceRegistry');
  const components =
    options.components ?? new Registry<unknown>('ComponentRegistry');
  const actions = options.actions ?? new Registry('ActionRegistry');
  const capabilities =
    options.capabilities ?? new Registry<unknown>('CapabilityRegistry');
  const permission = options.permission ?? createDefaultPermissionAdapter();
  const router = options.router ?? createDefaultRouterAdapter();
  const http = options.http ?? createFetchHttpAdapter();

  const route: RouteContext = {
    params: options.route?.params ?? {},
    query: options.route?.query ?? {},
    navigate: (to) => router.navigate(to),
  };

  // DataStore 加载时经 getScope 取当前作用域，故延迟引用 context
  let context: RuntimeContext;
  const data = new DataStore({
    dataSources: options.dataSources ?? {},
    services,
    http,
    getScope: () => buildScope(context),
  });

  context = {
    app: options.app ?? {},
    page: options.page ?? {},
    state,
    data,
    route,
    user: options.user ?? {},
    services,
    components,
    actions,
    permission,
    capabilities,
    http,
  };
  return context;
}

/** 表达式局部作用域（row / rowIndex / event / item 等） */
export type LocalScope = ExpressionScope;
