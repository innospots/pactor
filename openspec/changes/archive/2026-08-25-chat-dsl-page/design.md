# Design: chat-dsl-page

## Context

pactor 页面 DSL 体系：`*.page.yaml`（dsl/page/body 结构）经 vite-plugin-dsl 编译为 JS 模块，`createPageRuntime(pageDsl, options)` 渲染 body 树；组件来自注册表，宿主经 `options.components` 注入闭包组件。表达式作用域无 services；函数型 prop 无法从 DSL 产生——因此聊天页的运行时依赖（store/transport/registry/回调）必须由宿主闭包注入，DSL 只携带标量配置。DSL 内嵌节点槽有先例（Table `columns[].cell`），renderer 对带字符串 `type` 的 prop 对象跳过提前求值。

## Goals / Non-Goals

**Goals:**
- `createChatWorkspace(services)` → 可注册的 `<ChatWorkspace>`，DSL props 全部为标量/数组。
- examples/chat 页面改由 `chat.page.yaml` 声明，功能不回退。
- 探查并尽量支持 `sidebar?` / `toolbarEnd?` DslNode 槽。

**Non-Goals:**
- 消息内 dsl part 渲染机制不变。
- 多会话/持久化数据模型；AppShell 进布局注册表。

## Decisions

### D1: 工厂闭包注入，而非扩展表达式作用域
`createChatWorkspace({ transport, store? | storeFactory?, safeRegistry?, capabilities?, permission?, confirm?, user?, attachments?, onAttachFiles?, onAttachmentClick?, onMentionTrigger?, onPlusMenu?, toolbarStart?, toolbarEnd?, headerExtra? })` 返回组件。理由：表达式作用域只承载可序列化数据，加 services 会打开注入面；闭包注入是 `options.components` 既有先例。

**替代方案**：DSL `dataSources.type: service` 暴露 transport。否决——transport 是有状态连接工厂，不是数据查询。

### D2: 组件自持会话状态
ChatWorkspace 内部创建/持有 `ConversationStore`（默认 `() => new ConversationStore()`）与附件受控状态；DSL 重渲染/props 变化不重建 store（ref 保持）。外部需要控制时可传 `store` 或 `storeFactory`。

### D3: DSL 槽位走 cell 模式（可行才做）
调查 packages/runtime renderer 对注册组件渲染内嵌 DslNode prop 的支持路径（Table cell 的 renderChildren 机制如何到达组件）。可用 → `sidebar?: DslNode`、`toolbarEnd?: DslNode`，组件内用该机制渲染；不可用 → V1 仅宿主闭包注入 ReactNode，spec 不列该 requirement。

### D4: 示例保留双模式说明
examples/chat 主入口改为 DSL 页面（证明 DSL 构建能力）；宿主装配代码（bootstrap.ts/main.tsx）即"调用方参考实现"，README 说明哪些在 YAML、哪些在宿主闭包。

## Risks / Trade-offs

- [ChatWorkspace 同时被 React 与 DSL 两套范式使用导致 API 含糊] → 工厂返回的组件只声明 DSL 安全 props；React 直连场景继续用 ChatView 细粒度组件，README 区分两条路径。
- [DslNode 槽机制对注册组件不开放] → 降级为闭包注入（D3 已定回退路径），不阻塞 V1。
- [examples/chat 引入 vite-plugin-dsl 增加构建复杂度] → admin 示例已有同款配置可照抄。

## Open Questions

- createPageRuntime 的宿主包是 pactor-app 还是 pactor-runtime？实现时确认并从正确包导入。
