# Tasks: add-app-module

## 1. 包骨架

- [x] 1.1 创建 `packages/app`：dependencies 全部 10 个既有 pactor 包 workspace:*，peerDeps `react >=18`/`react-dom >=18`/`react-router-dom >=6`/`antd >=5`，devDeps 完整 react 测试栈；tsconfig、tsup、LICENSE、README、tests/setup.ts；`pnpm install` 成功

## 2. 启动编排（spec: application-bootstrap）

- [x] 2.1 options 处理与 loader 创建（api.baseURL / 注入 loader / authTokenProvider 注入 HTTP 头）
- [x] 2.2 bootstrap 编排：permission store / menu registry / layout 解析（优先级与缺省）/ 失败重试页 / 缺省字段
- [x] 2.3 共享 registries 组装（内置组件+交互动作+业务扩展）与页面运行时工厂（adapters/route/user/app 注入）
- [x] 2.4 app 实例：mount/unmount（重复 mount 先卸载）与 registerComponent/Action/Service/Capability

## 3. React 组合层（spec: application-shell）

- [x] 3.1 Application 组件：router（basename 支持）+ InteractionProvider + Layout + Routes/* + DynamicDslRoute（404/403）
- [x] 3.2 DslPageLoader：pageId 变化加载、loading 态、加载失败错误页、PageRuntimeView 渲染
- [x] 3.3 ErrorBoundary 包裹页面渲染
- [x] 3.4 OverlayHost 集成（resolvePage 接 loader，共享 registries；若 interaction 需最小补充允许并注明）
- [x] 3.5 admin 布局接线（brand/registry/bridge/route/开关）

## 4. 端到端测试

- [x] 4.1 StaticDslLoader 提供 bootstrap + 两个页面 DSL：菜单渲染 → 点击导航 → 页面渲染 → 表达式 → setState 动作
- [x] 4.2 overlay.open / message 端到端；404/403；ErrorBoundary；bootstrap 失败重试
- [x] 4.3 route params/query 注入与页面权限 denied 端到端

## 5. 验收与文档

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 5.2 文档站新增 `packages/app.md`（含 createPactorApplication 一站式示例），侧边栏与快速开始模块表同步；快速开始的一站式用法改用 pactor-app；`pnpm docs:build` 通过
