# Spec: chat-dsl-page

聊天页的 DSL 构建（`@pactor/chat`）：`createChatWorkspace` 工厂与 ChatWorkspace 组件的 DSL 页面集成。

### Requirement: createChatWorkspace 工厂

`@pactor/chat` SHALL 导出 `createChatWorkspace(services)`：宿主以闭包注入运行时服务（`transport` 必填；`store` 或 `storeFactory`、`safeRegistry`、`capabilities`、`permission`、`confirm`、`user`、附件回调、`onMentionTrigger`、`onPlusMenu`、工具栏槽位等可选），返回可注册进 DSL 组件注册表的 `ChatWorkspace` 组件。组件 SHALL 自持 ConversationStore（未提供 store 时经 storeFactory 或默认构造创建）与附件受控状态，且在 props 变化导致的重渲染中 MUST NOT 重建 store。

#### Scenario: 工厂创建组件

- **WHEN** 宿主以 transport 等服务调用 createChatWorkspace 并渲染返回组件
- **THEN** 聊天界面正常工作（发送经注入的 transport 驱动 turn）

#### Scenario: 重渲染不丢会话

- **WHEN** ChatWorkspace 的 props 变化触发重渲染
- **THEN** store 实例保持不变，既有消息不丢失

### Requirement: DSL 安全 props

`ChatWorkspace` 的 props SHALL 全部为 DSL 可表达的标量/数组：`title?` / `greeting?` / `subtitle?` / `suggestions?`（`ChatSuggestion[]`）/ `conversationId?` / `params?`。函数、类实例等不可序列化依赖 MUST NOT 出现在 props 中——一律由工厂闭包注入。

#### Scenario: DSL 声明聊天页

- **WHEN** 页面 YAML 的 body 为 `{ type: 'ChatWorkspace', props: { title, greeting, suggestions } }` 且宿主已注册该组件
- **THEN** 页面渲染聊天界面，问候语与建议按 YAML 配置展示

### Requirement: 页面运行时集成

ChatWorkspace SHALL 能经宿主注册进 pactor 页面运行时的组件注册表（`options.components`），由 `createPageRuntime` 渲染；`suggestions` 点击、发送、附件、工具栏等行为与直接使用 ChatView 一致（数据由闭包服务驱动）。

#### Scenario: 经 createPageRuntime 渲染

- **WHEN** 宿主注册 ChatWorkspace 后以 createPageRuntime 渲染含该节点的页面 DSL
- **THEN** 页面正常渲染，发送一条消息后 mock 对话流程完整走通
