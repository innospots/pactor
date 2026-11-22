# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **企业前端团队 / 业务开发者**：在管理后台、运营台、多租户产品、低代码工作台、AI 对话类产品中，用 YAML/JSON DSL 交付页面，而不是为每个列表/表单页写 React 组件并重新发版。
- **AI agent（经 `@pactor-app/skills`）**：DSL 被设计为可由 agent 安全生成与校验，Agent 是一等的页面作者。
- **框架贡献者**：在本 monorepo 中演进 24 个 `@pactor-app/*` 包。

## Product Purpose

**Pactor — Dynamic Application Runtime**：企业级 Server-Driven UI + AI-Native 前端运行时。页面结构抽成 DSL（`*.page.yaml`），浏览器内一套公共 Runtime 负责渲染、数据、权限与交互；**改普通业务页面原则上无需重新构建和发布前端**。DSL 内禁止任意 JavaScript（无 eval），服务端下发的页面在安全、可校验的边界内运行。保留 TypeScript/React 逃生舱，避免 DSL 演变为不可维护的“万能语言”。

成功意味着：业务方 `npm install` 一次框架后，页面、菜单、权限、布局可经 API 动态下发与迭代；AI 生成的 DSL 能经 schema 校验与安全 Registry 守卫直接上线。

## Positioning

不是 YAML Renderer，也不是 React 组件库，也不是托管低代码平台：

- **DSL 是协议而非配置**：描述应用、页面、状态、数据源、组件、事件、动作、生命周期。
- **动态 DSL、静态能力**：服务端可下发页面/菜单/权限，但组件、动作、服务必须由前端 Runtime 的 Registry 注册——动态能力与代码安全边界同时成立，这是托管低代码平台与纯组件库都无法照搬的机制组合。
- **AI-Native**：Chat 工作区（流式对话、DSL 消息片段、Safe Registry 白名单、capability 风险确认链）是框架一等能力，而非外挂。

## Operating Context

- pnpm workspace monorepo（tsup + vitest）：`packages/` 24 个包，`skills/`（`@pactor-app/skills` Agent 技能）、`starters/`（create-pactor-app 模板源码）、`examples/`（admin :5199、chat :5399、vite-starter :5499）、`tools/theme-studio`（:5710）。
- 文档站：Astro，dev :4334，已部署 Cloudflare Workers（pactor-docs.xp-java.workers.dev），面向外部使用者。
- 变更流程：OpenSpec（已归档 50 个变更，`openspec/specs/` 52 个能力为现状基准）。
- 发布：npm 公共 registry，`@pactor-app/*` 与 `pactor-app` meta 包，当前 1.72.0，MIT。
- 已规划（来自 2026-11-20 商业化讨论，**非仓库证据**）：私有仓 `innospots/pactor-pro` 承载商业 Pro 组件与 DSL 模板库，license key 门控；主仓核心保持 MIT 免费。

## Capabilities and Constraints

- DSL 版本 `dsl: '1.0'`；JSON Schema 校验（`@pactor-app/schema`、`pactor validate`）。
- 受控表达式引擎（自研 AST，无 eval；window/fetch/localStorage 不可达；`__proto__` 隔离）。
- 数据联动：`state` / `dataSources`（static|service|http）/ `${...}` 表达式 / 事件→标准动作（setState、reload、navigate、request 等）。
- 权限四层守卫（页面/菜单/组件/动作），**前端权限只管 UI，接口须后端鉴权**。
- 主题：shadcn 语义令牌 CSS 变量换肤、`data-pactor-theme="dark"`、全局密度 `data-pactor-size`（compact|comfortable）+ JS 自定义数值；`@pactor-app/theme` 14 套预置皮肤。
- 国际化 `${t('key')}`；`@pactor-app/chat`（流式、Chat/ChatShell DSL 组件、产物面板、审批队列）。
- 环境：Node ≥ 18、pnpm ≥ 9、React ≥ 18 peer；包均为 ESM+CJS+d.ts 双产物。
- 单向依赖方向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui, …} ← app`，禁止跨层引用实现细节。
- 已知边界：Next.js 集成仅 client island（`ssr:false`，路由建议 hash）；无内置“调用 service”动作；Form initialValues 变化不重置表单。

## Brand Commitments

- 名称：**Pactor**；npm 包统一 `@pactor-app/*` 前缀 + meta 包 `pactor-app`；明确不叫 yaml-renderer / yaml-ui / dsl-ui（无法表达菜单、路由、权限、交互层、动态发布与 AI Runtime 的完整能力）。
- 核心框架 MIT，商业化层（pactor-pro）独立商业许可，两者不混。
- 面向外部的文档站不得引用内部设计文档与 OpenSpec 代号。

## Evidence on Hand

- `README.md`（定位、场景、三分钟上手、模块表）、`design/framework-design.md`（内部权威设计规范，中文）、`docs/`（对外文档站源码）、`examples/`（admin / chat / vite-starter 可运行演示）、`MEMORY.md`（架构决策记录）、`dist-pack/`（历史发布 tarball）。
- **没有**客户证言、案例、基准数据或商标/Logo 资产——未来任何面向外部的页面不得虚构这些内容。

## Product Principles

1. **DSL 是协议**：页面可动态下发，能力必须静态注册；任何“把 JS 塞进 DSL”的诉求都拒绝。
2. **Runtime 是核心**：DSL → Parser/Validator → Runtime Context → 表达式/权限/数据源 → Registry → Renderer，链路每一环可测。
3. **普通页面零发版**：衡量框架价值的标尺是“改一个按钮要不要重新构建”。
4. **安全边界前置**：无 eval、Registry 白名单、AI 产物过 Safe Registry、高风险动作走确认链。
5. **React 逃生舱常开**：70-80% 页面纯 DSL，复杂页面直接写 React，不为覆盖率牺牲可维护性。
