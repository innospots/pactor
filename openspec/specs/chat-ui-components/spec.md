# chat-ui-components Specification

## Purpose
TBD - created by archiving change move-chat-ui-components. Update Purpose after archive.
## Requirements
### Requirement: 展示组件子路径导出

`@pactor-app/chat` SHALL 提供子路径出口 `@pactor-app/chat/components`（含 types/import/require 条件），导出全部 18 个 chat 展示组件：AgentStatus、ArtifactPanel、Attachment、Bubble、ChatMessage、ChatPage、Citation、Composer、ConversationList、MessageList、Prompt、Sender、StepsPanel、StreamingText、Suggestion、Thinking、ToolCall、Welcome。各组件 props 契约与视觉 MUST 与迁移前 `@pactor-app/ui` 版本一致。

#### Scenario: 子路径导入

- **WHEN** 宿主以 `import { ChatPage, Bubble } from '@pactor-app/chat/components'` 导入
- **THEN** 18 个组件均可正常导入并渲染

#### Scenario: 迁移后行为一致

- **WHEN** 以迁移前相同的 props 渲染任一组件
- **THEN** 渲染结构与交互行为与迁移前一致

### Requirement: 展示组件 DSL 注册

`@pactor-app/chat` SHALL 导出 `registerChatComponents(registry)`：向 DSL 组件注册表注册 18 个展示组件对应的类型（ChatPage、Bubble、ChatMessage、MessageList、Composer、ConversationList、ArtifactPanel、AgentStatus、Attachment、Citation、Prompt、Sender、StepsPanel、StreamingText、Suggestion、Thinking、ToolCall、Welcome）；已存在同名类型时 MUST NOT 覆盖。注册后页面 DSL 可以 `{ type: 'ChatPage', props, events }` 声明使用。

#### Scenario: 注册并声明

- **WHEN** 宿主调用 createComponentRegistry 后调用 registerChatComponents，页面 DSL body 为 `{ type: 'ChatPage' }`
- **THEN** createPageRuntime 正常渲染聊天页

#### Scenario: 不覆盖已有注册

- **WHEN** 注册表已含 ChatPage 类型时再次调用 registerChatComponents
- **THEN** 保留原注册，不覆盖

### Requirement: 样式独立分发

`@pactor-app/chat` 的构建 SHALL 包含 Tailwind 编译步骤（对齐 ui 的 `tsup && tailwindcss` 方式），使 `@pactor-app/chat/styles.css` 同时包含迁移组件使用的 Tailwind 工具类、既有 `.pactor-chat-*` 语义类与 `--pactor-chat-*` / `--pactor-chat-rail-*` 令牌。宿主引入 `@pactor-app/chat/styles.css` 后 chat 展示组件 SHALL 视觉完整（不依赖 `@pactor-app/ui/styles.css` 提供工具类）。

#### Scenario: 独立加载样式

- **WHEN** 宿主仅引入 `@pactor-app/chat/styles.css` 渲染 ChatPage / Composer / ArtifactPanel
- **THEN** 组件布局与视觉完整（工具类均已编译进样式表）

#### Scenario: rail 令牌随包分发

- **WHEN** 检索 `@pactor-app/chat/styles.css`
- **THEN** 含 `--pactor-chat-rail-width` 与 `--pactor-chat-rail-popover-width` 令牌定义

