# Tasks: chat-dsl-page

## 1. ChatWorkspace 工厂（packages/chat）

- [x] 1.1 调查 pactor-runtime 对内嵌 DslNode prop 的渲染支持（Table cell / renderChildren 机制对注册组件的可达性），结论写入 tasks.md 备注；可用则 ChatWorkspace 支持 `sidebar?`/`toolbarEnd?` DslNode 槽，不可用则仅闭包注入
  - 结论：**可用**。`DslRenderer` 的 `resolveProps` 对带字符串 `type` 的普通对象跳过提前求值（renderer.tsx `isEmbeddedDslNode`），内嵌 DslNode 原样作为 prop 到达组件；注册组件经 `useRenderer().renderChildren([node], extraScope?)` 渲染之（先例：ui-antd Table `columns[].cell`）。`useRenderer` 由 `pactor-runtime` 导出，pactor-chat 已依赖 pactor-runtime，无依赖方向问题。故 ChatWorkspace 支持 `sidebar?` / `toolbarEnd?` DslNode 槽（仅页面运行时上下文内有效；纯 React 直连用 `services.toolbarEnd` ReactNode 闭包槽）。未修改 packages/runtime。
- [x] 1.2 新增 `src/chat-workspace.tsx`：`createChatWorkspace(services)` 返回 ChatWorkspace 组件（自持 store + 附件状态、重渲染不重建、DSL 安全 props）
- [x] 1.3 测试（TDD）：工厂创建、store 自持与外部 store、重渲染不丢消息、DSL props 渲染、经页面运行时集成渲染
- [x] 1.4 `src/index.ts` 导出 `createChatWorkspace` / `ChatWorkspaceServices` / `ChatWorkspaceProps`

## 2. 示例 DSL 化（examples/chat）

- [x] 2.1 vite.config 接入 pactor() 插件；新增 `src/chat.page.yaml`（title/greeting/suggestions）；App 改为宿主装配（createChatWorkspace + 注册 + createPageRuntime）；保留全部既有演示能力
- [x] 2.2 验证：packages/chat 与 example-chat 的 test/typecheck/build 全绿；playwright 截图确认 DSL 页面功能完整（问候/建议、对话、附件、picker、明暗、侧栏）

## 3. 文档与收尾

- [x] 3.1 packages/chat/README.md + docs 站 chat 章节：DSL 构建路径说明（YAML 配置什么、宿主闭包注入什么）
- [x] 3.2 `openspec validate chat-dsl-page` 通过；全量 `pnpm -r test` / `pnpm -r --if-present build` 通过
