// 一站式入口（设计文档第 86–88 节）
export { createPactorApplication } from './application.js';
export type {
  AuthTokenProvider,
  PactorApplication,
  PactorApplicationOptions,
  PactorApplicationHandle,
  PactorAppSession,
  PactorRouterOptions,
  UiKit,
} from './application.js';
export { ReactRouterBinding } from './application.js';

// React 组合层（高级用法：不经 mount 自行嵌入时可用）
export { Application } from './app-shell.js';
export type { ApplicationProps } from './app-shell.js';
export { DslPageLoader } from './page-loader.js';
export type { DslPageLoaderProps } from './page-loader.js';
export { PageErrorBoundary } from './error-boundary.js';
