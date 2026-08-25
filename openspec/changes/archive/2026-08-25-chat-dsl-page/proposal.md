# Proposal: chat-dsl-page

## Why

聊天工作区页目前只能用 React 代码组装（examples/chat 的 App.tsx）。pactor 的页面体系是 DSL 驱动的（`*.page.yaml` → vite-plugin-dsl → createPageRuntime），聊天页应同样可以以 DSL 配置方式构建——调用方在 YAML 里声明页面与可配置项，运行时服务（store/transport/safeRegistry/capabilities/回调）由宿主经工厂闭包注入，符合接口边界原则。

## What Changes

- **新增 `createChatWorkspace(services)` 工厂**（`packages/chat`）：宿主以闭包注入全部运行时服务与交互回调（transport、safeRegistry、capabilities、confirm、user、附件回调、提及/`+` 回调、工具栏槽位等），返回可注册进 DSL 组件注册表的 `<ChatWorkspace>` 组件。组件自持 `ConversationStore`（或接受外部 store / storeFactory）与附件受控状态。
- **DSL 可配置 props**：返回的组件只接受 DSL 可表达的标量/数组 props——`title?` / `greeting?` / `subtitle?` / `suggestions?` / `conversationId?` / `params?`。函数型与实例型依赖一律不出现​​在 DSL props 中。
- **DSL 页面示例**：examples/chat 改造为 DSL 驱动——新增 `chat.page.yaml`（vite-plugin-dsl 编译），宿主代码（bootstrap）负责 createChatWorkspace + 注册组件 + createPageRuntime 渲染；现有全部交互能力（附件伪上传、picker、提及、工具栏 chip、AppShell 侧栏）保留，由宿主闭包注入。
- **DSL 插槽（探查后决定）**：调查 pactor-runtime 对内嵌 DslNode prop（Table `columns[].cell` 模式）的 `renderChildren` 支持是否对注册组件可用；若可用，`ChatWorkspace` 支持 `sidebar?` / `toolbarEnd?` 接受 DslNode 子树；不可用则 V1 不做，文档注明槽位由宿主闭包注入。

明确**不在本次范围**：修改 chat 消息内 dsl part 的渲染机制（与页面 DSL 是两个运行时实例，维持现状）；多会话数据模型；AppShell 本身进布局注册表。

## Capabilities

### New Capabilities
- `chat-dsl-page`: `createChatWorkspace` 工厂与 ChatWorkspace 组件的 DSL 页面集成（服务闭包注入、DSL 安全 props、页面 YAML 声明）。

### Modified Capabilities
- `example-chat`: 示例从纯 React 组装改为 DSL 页面驱动（`*.page.yaml` + 宿主装配），既有演示能力（mock transport 场景、Safe Registry、capability 确认链、附件/picker/提及）必须保留。

## Impact

- **代码**：`packages/chat`（新增 `chat-workspace.tsx` + 导出 + 测试）、`examples/chat`（新增 `chat.page.yaml`、vite.config 接入 pactor 插件、App.tsx 改为宿主装配）。
- **依赖**：packages/chat 不新增依赖（工厂只依赖既有类型）；examples/chat 新增 devDependency `pactor-app` / `pactor-vite-plugin-dsl`（按实际包名）。
- **API**：纯增量，无 BREAKING。
