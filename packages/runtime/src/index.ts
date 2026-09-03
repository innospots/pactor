// context：RuntimeContext / StateStore / 适配接口 / 作用域（非 React）
export {
  createDefaultPermissionAdapter,
  createDefaultRouterAdapter,
  createFetchHttpAdapter,
} from './context/adapters.js';
export type {
  HttpAdapter,
  HttpRequestConfig,
  PermissionAdapter,
  RouterAdapter,
} from './context/adapters.js';
export { createRuntimeContext } from './context/context.js';
export type {
  CapabilityRegistry,
  ComponentRegistry,
  CreateRuntimeContextOptions,
  FormHandle,
  FormRegistry,
  LocalScope,
  RouteContext,
  RuntimeContext,
  ServiceHandler,
  ServiceRegistry,
} from './context/context.js';
export { buildScope } from './context/scope.js';
export { StateStore } from './context/state-store.js';
export { I18nContextProvider, useI18n } from './context/i18n-context.js';

// datasource：DataSource 运行时（非 React）
export { DataStore } from './datasource/data-store.js';
export type {
  DataSourceStatus,
  DataStoreDeps,
} from './datasource/data-store.js';

// action：Action 引擎与内置动作（非 React）
export { registerBuiltinActions } from './action/builtins.js';
export { ActionEngine } from './action/engine.js';
export type {
  ActionContext,
  ActionHandler,
  ActionRegistry,
  ActionResult,
} from './action/engine.js';

// renderer：React Renderer
export { DslRenderer } from './renderer/renderer.js';
export type {
  ComponentEntry,
  DslRendererProps,
  ScopedComponentEntry,
} from './renderer/renderer.js';
export {
  useDataSource,
  useRenderer,
  useRuntimeState,
} from './renderer/renderer-context.js';
export type { RendererContextValue } from './renderer/renderer-context.js';
export { UnsupportedComponent } from './renderer/unsupported.js';
export {
  FRAGMENT_COMPONENT_TYPE,
  FragmentComponent,
} from './renderer/fragment.js';
export type { FragmentProps } from './renderer/fragment.js';

// page：PageRuntime
export {
  createPageRuntime,
  PageRuntimeError,
  PageRuntimeView,
} from './page/page-runtime.js';
export type { PageRuntime } from './page/page-runtime.js';

// 工具
export { resolveDeep } from './utils/resolve.js';
