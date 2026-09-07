# Proposal: example-chat-on-pactor-app

## Why

`examples/chat` 目前以手写 React 装配（HashRouter + react-router-dom + MenuRegistry + ChatShell 直连 + DynamicDslRoute + 逐页 createPageRuntime，约 400 行 App.tsx），与 `examples/admin` 使用的 `createPactorApplication` 一站式路径不一致：同一份"宿主如何装配 pactor 应用"的示范存在两套写法，且 chat 示例没有覆盖 bootstrap 资源（菜单 / 布局由服务端下发）这一核心叙事。将 chat 示例迁移到 `pactor-app` 构建后，两个示例统一为"bootstrap 下发菜单与布局 + DSL 页面 + 宿主仅注入服务"的同一范式，chat 示例也能验证应用框架对 Chat 一类组件的承载能力。

## What Changes

- `examples/chat` 的应用装配改为 `createPactorApplication`（`pactor-app` 一站式 API）：删除手写 `HashRouter` / `MenuRegistry` / `DynamicDslRoute` / 逐页 `createPageRuntime` 装配代码（App.tsx、Shell、DslPage）
- 菜单（对话 / 我的智能体 / 系统设置 + 「最近」分组历史会话）与布局改由模拟 bootstrap 资源下发（`StaticDslLoader`），对齐 examples/admin 的 `bootstrap.ts` 模式
- 应用外壳经 `layoutRegistry` 自定义 chat 布局（基于 ChatShell：品牌行 + collapsible + 分组菜单 + sidebarFooter），bootstrap `layout.type: 'chat'`
- 聊天服务（transport / safeRegistry / capabilities / callService / 附件伪上传 / confirm）经 `providers` 槽注入；ConversationStore 按会话缓存改为 `storeFactory` 闭包按当前会话 id 取缓存实例
- 页面 DSL（chat / agents / settings.page.yaml）与全部演示能力（流式 mock、Safe Registry、capability 确认链、附件、上下文 chips、模型切换、产出物面板）保持不变
- 依赖调整：以 `pactor-app` meta 包为入口，移除对 `react-router-dom`、`@pactor-app/router`、`@pactor-app/runtime` 的直接依赖

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `example-chat`: 「DSL 页面驱动」需求的宿主装配职责变化——宿主不再手写菜单注册表 / 路由出口 / createPageRuntime 装配，改由 `createPactorApplication` 承担（bootstrap 下发菜单与布局，宿主仅提供 loader / services / providers / componentRegistry / layoutRegistry / actions）；「可启动可构建」需求不变；新增对「最近」会话跨页切换不丢消息的装配级要求

## Impact

- **代码**：`examples/chat/src`（App.tsx 删除或大幅精简、main.tsx 改为 createPactorApplication、新增 bootstrap.ts、chat 布局组件、store 缓存工厂）；`examples/chat/package.json` 依赖调整
- **框架**：预期不改动 `packages/*`（layoutRegistry / providers / actions 槽位已存在）；若迁移中发现应用框架对 Chat 承载的缺口（如 query 变化页面重建、菜单扩展字段透传），作为实现期发现另行评估
- **规格**：`openspec/specs/example-chat/spec.md` 需求级更新
- **不影响**：`packages/chat` 包本身、其余示例、已发布 API
