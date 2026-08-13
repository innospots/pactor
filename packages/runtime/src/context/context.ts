import { Registry, createI18nContext, type DataSourceConfig, type I18nContext, type PageMeta } from 'pactor-core';
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

/**
 * Form 句柄（表单联动桥，决策同 UiBridge）：
 * Form 组件挂载时注册、卸载注销；`form.setValues` 动作经它写入字段值。
 * setValues 不触发校验与 onValuesChange（避免联动循环）。
 */
export interface FormHandle {
  setValues(values: Record<string, unknown>): void;
}

/** Form Registry：表单名 → 句柄（缺省名 'default'） */
export type FormRegistry = Registry<FormHandle>;

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
  /** 表单句柄注册表：Form 组件挂载注册，`form.setValues` 动作寻址 */
  forms: FormRegistry;
  /**
   * 命名动作结果记录（设计文档第 48 节，决策 D2）：
   * 带 `id` 的动作执行完成后写入——成功时为结果数据，失败时为
   * `{ ok: false, error }`；经 `buildScope` 以 `actions` 键暴露给
   * 表达式（`${actions.<id>.success}`）。页面级共享：同一
   * RuntimeContext 的所有事件分发读写同一记录，PageRuntime
   * destroy 时清理。
   */
  actionResults: Record<string, unknown>;
  permission: PermissionAdapter;
  capabilities: CapabilityRegistry;
  /** HTTP 出口适配器（DataSource / request 动作共用） */
  http: HttpAdapter;
  /** 当前语言代码（如 'zh-CN'） */
  locale: string;
  /** i18n 上下文：提供 `t(key, params?)` 翻译函数 */
  i18n: I18nContext;
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
  forms?: FormRegistry;
  permission?: PermissionAdapter;
  router?: RouterAdapter;
  http?: HttpAdapter;
  capabilities?: CapabilityRegistry;
  /** 当前语言代码（缺省 'zh-CN'） */
  locale?: string;
  /** 回退语言代码（缺省 'zh-CN'） */
  defaultLocale?: string;
  /** 翻译消息表 */
  messages?: Record<string, string | Record<string, string>>;
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
  const forms = options.forms ?? new Registry<FormHandle>('FormRegistry');
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
    forms,
    actionResults: {},
    permission,
    capabilities,
    http,
    locale: options.locale ?? 'zh-CN',
    i18n: createI18nContext({
      locale: options.locale,
      defaultLocale: options.defaultLocale,
      messages: options.messages,
    }),
  };
  return context;
}

/** 表达式局部作用域（row / rowIndex / event / item 等） */
export type LocalScope = ExpressionScope;
