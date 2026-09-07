# Proposal: chat-composer-slots

## Why

`ChatInput`（`@pactor-app/ui`）的结构包含 `toolbarStart` / `toolbarEnd` / `footer` 三个自定义区域，chat 的 Composer 已以它呈现，但 `Chat` 组件的调用方目前无法声明这些区域：`Chat` props 没有任何工具栏槽（仅 `ChatServices` 有 ReactNode 的 toolbarStart/toolbarEnd、`createChatWorkspace` 有 DslNode 的 toolbarEnd），`footer` 区域则在任何层级都不存在。DSL 页面里 `{ type: 'Chat' }` 声明聊天页时，工具栏与 footer 的内容（如业务操作钮、上下文说明、工作空间选择等）应可经槽位自定义，与 sidebar / headerExtra / inspector 等既有槽位同构。

## What Changes

- `Chat` props 新增三个 Composer 槽位（DslNode | ReactNode 双型，与 sidebar / headerExtra 同款 resolveSlot 机制）：`toolbarStart`（工具栏左端）、`toolbarEnd`（工具栏右端、发送钮之前）、`composerFooter`（footer 区域，工具栏下方、带分隔线）
- `ChatServices` 同步支持 `composerFooter`（ReactNode）——服务级注入与 props 槽并存（与 toolbarEnd 的合并语义一致：服务槽在先、props 槽在后）
- Composer 新增 `composerFooter` prop：fallback 路径渲染 footer 区（结构与 ChatInput 一致：border-t 分隔）；DSL 路径经片段的 ChatInput `footer` 槽 + 内部组件 `ChatComposerFooter` 承载
- `createChatWorkspace` 的 ChatWorkspace props 同步（DslNode 形态）
- 既有 toolbarStart/toolbarEnd 语义不变（内建 +/附件/模型 chip 位置规则、附加约束均不动）

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-composer-extensions`: 新增需求「Composer footer 槽」——footer 区域的声明与渲染（fallback / DSL 双路径一致，带分隔线，未提供不渲染）
- `chat-dsl-component`: 新增需求「Composer 槽配置」——`Chat` 的 toolbarStart / toolbarEnd / composerFooter 双型槽（DslNode 经 renderChildren、ReactNode 原样渲染；纯 React 使用时接受 ReactNode）

## Impact

- **代码**：`packages/chat/src/view/Chat.tsx` / `chat-composition.tsx` / `view/ChatView.tsx` / `view/Composer.tsx` / `view/chrome/composer.tsx` / `chat-workspace.tsx` / `chat-services.tsx`
- **规格**：`chat-composer-extensions`、`chat-dsl-component` 增量
- **不影响**：既有槽位与内建特性契约、ChatInput 组件（footer 槽已存在）、无 footer 声明时的 DOM（零渲染承诺：未提供 composerFooter 时不渲染 footer 区）
