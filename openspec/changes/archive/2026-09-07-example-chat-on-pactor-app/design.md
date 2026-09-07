# Design: example-chat-on-pactor-app

## Context

`examples/chat` 当前为手写装配的参考实现：`App.tsx`（约 400 行）以 HashRouter + `MenuRegistry` + `ChatShell`（React 直连）+ `DynamicDslRoute` + 逐页 `createPageRuntime` 组织三页（chat / agents / settings），宿主承担菜单注册表、路由出口、运行时创建、按会话缓存 ConversationStore 等全部装配职责。`examples/admin` 已走在 `createPactorApplication`（`@pactor-app/app`，经 `pactor-app` meta 包转发）路径上：bootstrap 资源下发菜单与布局，`StaticDslLoader` 本地喂入，宿主仅提供 loader / services / providers / componentRegistry / actions。

已核实的框架能力（packages/app/src）：

- `layoutRegistry` 选项可整体替换外壳布局（`application.ts:88`），bootstrap `layout.type` 解析逻辑不变；
- `providers` 槽位于 Router 之内、InteractionKit 之外（`application.ts:118`），内部可用 react-router hooks；
- 路由出口按 `pageId + params + query` key 重建页面（`app-shell.tsx:209`），与现示例手写 key 语义一致——`?id=` 切换会话会重建页面；
- 非 admin 布局当前只接收 `{ brand, children }`（`app-shell.tsx:202`），不接收 menuRegistry / bridge。

## Goals / Non-Goals

**Goals:**

- `examples/chat` 应用装配迁移到 `createPactorApplication`：删除手写路由 / 菜单注册表 / 路由出口 / 逐页运行时装配
- 菜单（含「最近」分组历史会话、badge、dot）与布局由模拟 bootstrap 资源下发，对齐 examples/admin 范式
- 保留 ChatShell 参考形态（品牌行 + collapsible + 分组菜单 + sidebarFooter 用户卡）作为自定义 chat 布局
- 全部既有演示能力不回退（流式 mock / Safe Registry / capability 确认链 / 附件 / 上下文 chips / 模型切换 / 产出物面板 / 会话切换不丢消息）

**Non-Goals:**

- 不改动 `packages/chat` 的任何 API 与样式
- 不改动页面 DSL（chat / agents / settings.page.yaml）的声明内容
- 不引入真实后端；bootstrap 仍为本地 mock
- 不扩展应用框架能力（除非实现期发现阻断性缺口，见 Risks）

## Decisions

### D1：入口依赖用 `pactor-app` meta 包

`main.tsx` 从 `pactor-app` 导入 `createPactorApplication`（meta 包转发 `@pactor-app/app` 一站式 API），对齐"用 pactor-app 构建"的目标叙事。chat 专属 API（`ChatServicesProvider` / `registerChatComponent` / `createSafeRegistry` / styles）仍从 `@pactor-app/chat` 直接导入——meta 包不转发 chat API，显式依赖比穿透 transitive 依赖干净。

- 备选：全部从 `@pactor-app/app` + `@pactor-app/chat` 导入（examples/admin 现状）。放弃理由：本变更的目的就是示范 meta 包一站式路径。
- 移除直接依赖：`react-router-dom`、`@pactor-app/router`、`@pactor-app/runtime`（均由框架内部使用）；保留 `@pactor-app/ui`（组件注册表 + styles.css）。

### D2：菜单与布局经 bootstrap 下发（StaticDslLoader）

新增 `bootstrap.ts`：返回 `{ app, menus, layout: { type: 'chat' }, pageVersions }`。菜单即现 `DEMO_MENUS` 平移（对话 / 我的智能体 / 系统设置 + 「最近」分组四项历史会话），`group` / `dot` 作为扩展字段随菜单项下发（`MenuItem` 未声明这两字段，但 registry 保留原始项，布局映射时读取，与现示例 `DemoMenuItem` 做法一致）。`StaticDslLoader` 同时喂入三页 DSL 静态导入。

### D3：chat 外壳为自定义布局（layoutRegistry）

新增 `ChatAppLayout`（注册为 `type: 'chat'`）：内部以 `ChatShell` 渲染品牌行 / collapsible / 分组菜单 / sidebarFooter 用户卡。因非 admin 布局只收 `{ brand, children }`（app-shell.tsx:202），布局自给自足：

- 菜单树：模块级单例 `MenuRegistry`（与 D2 同一份 bootstrap menus 构造）取可见树，映射为 `ChatMenuItem`（group / dot / badge 透传）；
- 导航与高亮：布局在 Router 之内渲染，直接用 `useReactRouterBridge()` 与 `useLocation()` 推导 activeMenuKey（含「最近」会话 `?id=` 高亮修正逻辑，从现 App.tsx 平移）；
- `onMenuSelect` → `bridge.push`（`/chat?id=<key>` 约定不变）。

- 备选：扩展 app-shell 向所有布局透传 session（registry / bridge / route）。放弃理由：本变更限定不动框架；模块级 registry 对静态 mock 示例足够，且与 admin 示例"布局由框架供给"的差异在示例注释中说明。若后续框架补齐透传，示例再简化。

### D4：聊天服务与会话缓存经 providers 槽注入

新增 `ChatProvider`（options.providers）：

- 根部注入一次稳定服务：transport（mock）、safeRegistry、capabilities、callService（agents / contexts / quoteMessage 服务桥）、confirm、附件伪上传与点击回调——现 `chatServices` useMemo 逻辑平移为模块级常量；
- 会话 store：`ChatProvider` 内 `useLocation()` 读 `query.id`，模块级 `Map<string, ConversationStore>` 缓存按 id 取实例，以嵌套 `ChatServicesProvider` 就近注入（等价现 DslPage 的 chatServices 嵌套）。框架按 query key 重建页面（app-shell.tsx:209），切换会话时新页面拿到对应缓存 store，消息不丢。

- 备选：`storeFactory` 闭包读 `window.location`。放弃理由：依赖 URL 读取时机，不如 provider 显式按 query 注入清晰。

### D5：动作与反馈经 options.actions + 既有 ui-bridge

`navigate` 动作用框架内建（router adapter 已接入应用导航桥）；`message` 动作经 `options.actions` 注册，转发到示例 `ui-bridge.ts` 的 `showMessage`（toast）——现 DslPage 内两个 action 注册逻辑平移到入口。confirm 走 `ShadcnInteractionProvider` 已由框架 InteractionKit 承载，示例根部不再手动挂。

### D6：Hash 路由切换为 history 路由

框架内置 BrowserRouter（admin 示例同），URL 由 `/#/chat?id=x` 变为 `/chat?id=x`。vite dev / preview 的 SPA fallback 天然支持；README 同步更新。

## Risks / Trade-offs

- [非 admin 布局不接收 registry / route，布局需自建模块级 registry 与路由 hooks] → 实现期验证 `MenuRegistry` 保留 group / dot 扩展字段、布局在 Router 上下文内可用 hooks；若不成立，回退为最小框架扩展（向自定义布局透传 session），并更新本设计
- [`message` 等动作框架可能已有内建实现，与示例自定义冲突] → 实现期核对框架内建 ActionRegistry，内建可用则优先内建，避免重复注册语义分叉
- [功能回退（三页交互细节多：settings 保存 toast、agents 页跳会话、chips / 模型切换）] → 以现规格「功能不回退」场景为验收清单逐项手测；根级 `pnpm -r build/test/typecheck` 必须全绿
- [URL 方案变化影响既有书签 / 文档截图] → 仅示例应用，无外链依赖；README 与示例注释同步

## Migration Plan

单示例内部重构，无发布物：按 tasks.md 顺序改造 → 根级构建 / 测试 / typecheck 全绿 → 手动按验收清单过一遍演示场景。回滚 = git revert。

## Open Questions

- 框架内建动作是否已覆盖 `message`（toast）？实现期核对后决定 D5 的注册范围
- `layout.type: 'chat'` 之外是否还需 layout config 字段（如默认折叠态）？初版不需要，留待实现期评估
