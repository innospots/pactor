# Spec: chat-view

Chat React 视图与布局（`pactor-chat`）：ChatView / MessageBubble / PartRenderer / Composer 与 chat 布局注册。

### Requirement: 消息列表渲染

`<ChatView store>` SHALL 订阅 ConversationStore 渲染消息列表：user 与 assistant 消息按 role 区分呈现（气泡/对齐区分），parts 按序逐个渲染。

#### Scenario: 渲染对话

- **WHEN** store 含一条 user 与一条 assistant markdown 消息
- **THEN** 两者均出现，markdown 渲染为元素而非源码

#### Scenario: 流式更新

- **WHEN** reducer 推入 text.delta
- **THEN** 对应消息内容实时追加更新

### Requirement: PartRenderer

按 part 类型渲染：text → 文本段落；markdown → pactor-markdown；dsl → runtime Renderer（Safe Registry + chat 作用域）；tool-call / tool-result → 可折叠状态卡（名称 + 状态）；thinking → 默认折叠；error → 错误提示；status → 弱提示。

#### Scenario: dsl part 渲染白名单组件

- **WHEN** dsl part 的 schema 为白名单内的 Statistic 类组件
- **THEN** 正常渲染；非白名单组件渲染受控占位

#### Scenario: tool 状态卡

- **WHEN** part 为 tool-call（status running）
- **THEN** 渲染含工具名与 running 状态的卡片，可折叠

#### Scenario: thinking 折叠

- **WHEN** part 为 thinking
- **THEN** 默认折叠展示，与正文分离

### Requirement: Composer

SHALL 提供输入框与发送：Enter 发送、Shift+Enter 换行；空文本 MUST NOT 发送；提供 onSend 回调或经 transport 驱动 turn。

#### Scenario: 发送消息

- **WHEN** 输入文本并按 Enter
- **THEN** onSend 被以该文本调用，输入框清空

#### Scenario: 空文本不发送

- **WHEN** 输入为空白按 Enter
- **THEN** onSend 不被调用

### Requirement: chat 布局注册

`registerChatLayout(layoutRegistry)` SHALL 注册 `chat` 布局（header 标题区 + ChatView 区）；注册后 `resolveLayout(registry, 'chat')` 命中。

#### Scenario: 注册并解析

- **WHEN** 注册后 resolveLayout('chat')
- **THEN** 返回 chat 布局组件
