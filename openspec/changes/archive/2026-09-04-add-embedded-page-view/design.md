# Design: add-embedded-page-view

## Context

`createPactorApplication` 的组装链：loader → bootstrap → registries → Router（react-router）→ 布局 → DynamicDslRoute → PageRuntime。其中路由与整体布局强绑定 react-router（`app-shell.tsx`），导致存量项目无法局部嵌入。而 `@pactor-app/runtime` 的 `createPageRuntime` + `DslRenderer` 虽可独立使用，但调用方要自己组装 registries、UI kit、交互层（UiBridge / OverlayManager）、i18n——这些都是 app 层已经封装好的能力。

## Goals / Non-Goals

**Goals:**

- 一行接入：`<PactorPage pageId="customer-detail" />` 或 `createPactorPage({...})` 工厂返回组件
- 嵌入页拥有与整应用一致的能力：组件/动作/服务扩展、UI kit、交互层（confirm/message/overlay）、i18n
- 宿主路由完全自主：React Router、Next.js、或不设路由的局部嵌入均可
- 与整应用模式共享组装内核（同一套 registries / ui kit / interaction 装配代码），不复制实现

**Non-Goals:**

- 不做菜单驱动路由的任何改动（模式 1 行为不变）
- 不做多页签、菜单、品牌等外壳能力（嵌入模式没有外壳）
- 不做 react-router 之外的官方绑定（Next.js 绑定示例放文档，不进包）
- 不解决跨页 DSL 资源缓存策略（沿用 loader 自身缓存）

## Decisions

### D1：嵌入式入口只做「页面级组装」，不碰路由

`createPactorPage(options)` 返回一个 React 组件（同时导出等价的 `<PactorPage>`）。内部组装：组件/动作/服务/能力 registries + UI kit 预设（缺省 shadcnUiKit）+ 交互层 Provider/OverlayHost + I18nContextProvider + DslPageLoader/PageRuntime。不含 Router、不含外壳布局——页面 DSL 的 `body` 直接渲染（页面需要布局结构时用布局组件，见 add-layout-components）。

*备选：嵌入模式也提供可选外壳——违背「嵌入即局部」的定位，否决。*

### D2：跳转走声明式自然导航，不注入宿主路由对象

嵌入模式**不接受、不需要**宿主的路由实例。两类跳转诉求分别覆盖：

- **页面内链接**：新增 `Link` 组件（`href` / `text` / `target?` / children），渲染为原生 `<a>`——浏览器自然跳转，目标可以是旧项目的任意路由
- **`navigate` 动作**：嵌入模式缺省退化为 `location.assign(to)` 整页跳转（自然导航，目标页由宿主自己的路由系统承接）

`route.params` / `route.query` 仍由调用方经 props 传入（如 Next.js 的 `searchParams`、react-router 的 `useParams()`）——这是纯数据注入，不涉及路由对象。

*备选：注入宿主 RouterAdapter 做 SPA 跳转——把宿主路由实现耦合进框架，且跨路由库（react-router/Next/无路由）语义无法统一，否决。*

### D3：与整应用模式共享装配内核

抽出共用的组装函数（registries / ui / interaction / i18n 装配），`createPactorApplication` 与 `createPactorPage` 都调它。保证两种模式行为一致（同一 DSL 在两种模式下渲染结果相同），也为后续 router-agnostic（app 包与 react-router-dom 解耦）铺路：嵌入模式只依赖内核，不 import react-router-dom。

### D4：资源来源二选一

`pageId`（经 options.loader 加载，走 @pactor-app/resource 的缓存/版本机制）或直接传 `page`（PageDsl 对象，宿主自管）。`pageId` 加载失败渲染带重试的错误页（复用现有 feedback 组件）。

## Risks / Trade-offs

- [嵌入页与宿主样式隔离不足（CSS 变量令牌挂 :root）] → 文档说明：宿主全局引入 `@pactor-app/ui/styles.css`；令牌冲突时用 `data-pactor-theme` 作用域隔离
- [多个嵌入页实例并存时交互层（overlay/message）多实例] → 每个 PactorPage 自持 OverlayManager/UiBridge 实例，互不影响（测试覆盖）
- [嵌入模式没有 bootstrap，permission() 函数无权限码来源] → options 增加 `permissions?: string[]`（或 PermissionAdapter），缺省全部放行并在文档说明

## Migration Plan

纯新增入口，无迁移。现有 `createPactorApplication` 用户零感知。

## Open Questions

- 嵌入页是否需要 `onReady` / `onError` 等宿主回调？V1 提供 `onError`，其余观察需求
