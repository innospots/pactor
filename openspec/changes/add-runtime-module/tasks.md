# Tasks: add-runtime-module

## 1. 包骨架

- [x] 1.1 创建 `packages/runtime`：`package.json`（`pactor-runtime`，dependencies 为三个基础包 workspace:*，peerDependencies `react >=18`，devDependencies 加 react/react-dom/@types/@testing-library/react/jsdom）、tsconfig、tsup 配置、vitest 配置（jsdom 环境）
- [x] 1.2 `pnpm install` 成功

## 2. RuntimeContext 与 StateStore（非 React，spec: runtime-context）

- [x] 2.1 实现 `StateStore`：getState/get(路径)/set(对象合并与路径写入)/reset/subscribe（含退订）
- [x] 2.2 实现适配接口与默认实现：`PermissionAdapter`（默认放行）、`RouterAdapter`（默认 no-op）、`HttpAdapter`（默认 fetch 封装）
- [x] 2.3 实现 `createRuntimeContext`：组装 app/page/state/data/route/user/services/components/actions/permission/capabilities，支持注入自定义 registry 与 adapter
- [x] 2.4 实现表达式作用域构建 `buildScope(context, local?)`：state/data 取当前值，local 覆盖同名键
- [x] 2.5 单测：StateStore 全部行为、上下文组装、作用域覆盖规则、ServiceRegistry、默认 adapter

## 3. DataSource 运行时（spec: datasource-runtime）

- [x] 3.1 实现 `DataStore`：按名维护 `{ loading, error, data }`，get/getData/subscribe/refresh/reload，状态流转与错误不落渲染层
- [x] 3.2 实现 `static` 类型加载
- [x] 3.3 实现 `service` 类型：ServiceRegistry 解析 + params 表达式求值 + 未注册受控错误
- [x] 3.4 实现 `http` 类型：HttpAdapter 请求，request 字段每次加载前求值
- [x] 3.5 实现 autoLoad 触发与 reload 缺省刷新全部 autoLoad 源
- [x] 3.6 单测：成功/失败状态流转、三种类型、autoLoad、reload 语义

## 4. Action 引擎（spec: action-engine）

- [x] 4.1 实现执行管线：condition 求值跳过 → permission 拦截 → registry 执行；未注册受控失败；params 表达式求值
- [x] 4.2 内置动作：setState、resetState
- [x] 4.3 内置动作：reload（指定/缺省）、request（结果写入 state 目标路径）
- [x] 4.4 编排动作：sequence（失败中断）、parallel、if、delay
- [x] 4.5 事件动作数组串行执行
- [x] 4.6 单测：管线各拦截分支、全部内置动作、编排语义

## 5. React Renderer（spec: dsl-renderer）

- [x] 5.1 实现 RuntimeReactContext 与订阅 hooks（useSyncExternalStore，任一 state/data 变化触发 DSL 树重渲染）
- [x] 5.2 实现 `renderNode`：Registry 查找、UnsupportedComponent 占位、children 递归、无类型名硬编码分支
- [x] 5.3 实现 props 深度表达式解析（hasExpression 快速路径）
- [x] 5.4 实现 `when` 条件渲染与 `events` 绑定（event 作用域注入）
- [x] 5.5 实现子作用域机制：`renderChildren(children, extraScope)` 经 context 提供给组件
- [x] 5.6 组件测试（Testing Library + jsdom）：已注册/未注册渲染、表达式 props、state 变化重渲染、when、events、子作用域、children 顺序

## 6. PageRuntime（spec: page-runtime）

- [x] 6.1 实现 `createPageRuntime`：schema 校验（失败抛 PageRuntimeError 含结构化错误）→ 创建上下文 → 初始化 state/dataSources → autoLoad → onInit
- [x] 6.2 实现生命周期编排：onInit/onLoad/onReady/onShow/onHide/onDestroy，暴露宿主触发方法，destroy 清理订阅
- [x] 6.3 实现渲染入口（`render()` 与 `<PageRuntimeView />`），无 body 渲染为空
- [x] 6.4 单测/组件测试：非法 DSL 抛错、初始化链路、生命周期顺序、渲染入口

## 7. 整体验收

- [x] 7.1 `pnpm -r build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 7.2 检查 renderer 之外的源码不 import react（非 React 部分可 Node 独立运行）
- [x] 7.3 用设计文档第 10 节 Page DSL + 注册测试组件做端到端验证：state → 表达式 props → 事件动作 → 数据源 reload
- [x] 7.4 更新文档站：快速开始页模块表与新增 `pactor-runtime` 模块页
