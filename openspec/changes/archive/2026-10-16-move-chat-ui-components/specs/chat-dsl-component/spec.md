# Delta: chat-dsl-component

## ADDED Requirements

### Requirement: Chat 展示组件注册

`@pactor-app/chat` SHALL 导出 `registerChatComponents(registry)`：注册 chat 展示组件族的 18 个 DSL 类型（见 chat-ui-components），与 `registerChatComponent`（`Chat` 类型）并存且互不覆盖；已存在同名类型时 MUST NOT 覆盖。宿主需要 chat 展示组件 DSL 类型（如 `{ type: 'ChatPage' }` 的模板页）时 SHALL 在创建注册表后显式调用；`createComponentRegistry` 的 `builtinComponents` MUST NOT 内置这些类型。

#### Scenario: 注册后声明 ChatPage

- **WHEN** 宿主调用 createComponentRegistry 后调用 registerChatComponents，页面 DSL body 为 `{ type: 'ChatPage' }`
- **THEN** createPageRuntime 正常渲染聊天页

#### Scenario: 未注册时不内置

- **WHEN** 宿主仅调用 createComponentRegistry（不调用 registerChatComponents），页面 DSL 引用 `{ type: 'ChatPage' }`
- **THEN** 按 DSL 未注册类型的既有兜底语义处理，builtinComponents 不内置该类型

#### Scenario: 不覆盖已有注册

- **WHEN** 注册表已含 ChatPage 类型时调用 registerChatComponents
- **THEN** 保留原注册，不覆盖
