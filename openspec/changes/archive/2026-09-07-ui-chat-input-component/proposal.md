# Proposal: ui-chat-input-component

## Why

AI 对话类产品的主流输入框形态是多行文本 + 内嵌工具栏 + 底部配置区的复合结构（参考截图形态：顶部 textarea、中间工具栏行含附件/模型选择/发送钮、底部「选择工作空间 / 默认权限」配置行）。`@pactor-app/ui` 现有 `Textarea` 只是裸输入控件，业务要用 DSL 搭出这种结构需要手写 React 组件或大量私有样式，违背"页面以 DSL 组合"的范式。把**聊天输入框**作为 registry 一等组件提供，结构与槽位由组件承担，内容（工具栏按钮、底部配置项）由 DSL 声明。

## What Changes

- 新增 registry 组件 `ChatInput`（`@pactor-app/ui`，`components/ChatInput/`）：嵌套两层结构——外层圆角容器（focus-within 高亮）内依次承载**自适应高度 textarea**、**工具栏行**、**可选底部区**（带上分隔线）
- DSL props：`value`（受控）/ `placeholder` / `disabled` / `rows`（最小行数）/ `hideSend`；事件 `onChange(value)` / `onSubmit(value)`（点击发送钮或 Enter；Shift+Enter 换行；IME 合成中 Enter 不发送；空文本不发送；发送后清空非受控值）
- 槽位（DslNode，经 renderChildren 渲染）：`toolbarStart`（工具栏左端）/ `toolbarEnd`（工具栏右端、发送钮之前）/ `footer`（底部区，提供时渲染）——工具栏与底部区内容完全由 DSL 自定义
- 内建发送按钮（圆形 arrow-up 图标钮，空文本禁用，`hideSend` 可隐藏）
- 视觉只定义结构（容器/间距/分隔线/按钮形态），颜色全部消费 shadcn 语义令牌（参考截图仅取结构，不取配色）
- 文档站组件参考新增 ChatInput 条目（form 分类）；组件总数计数同步

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `shadcn-extended-components`: 新增「ChatInput 聊天输入组件」需求——registry 注册、两层嵌套结构、受控值与事件契约、toolbarStart / toolbarEnd / footer 槽位、发送交互语义（Enter / IME / 空文本 / 清空）

## Impact

- **代码**：`packages/ui/src/components/components/ChatInput/`（新）、`packages/ui/src/components/register.ts`（注册）、`packages/ui/tests/components/`（测试）
- **文档**：`docs/src/content/docs/components/`（form 分类新增条目 + 总数计数）
- **依赖**：无新增（复用 vendored shadcn 原语与 lucide 图标）
- **不影响**：既有组件契约；`@pactor-app/chat` 的 Composer 保持包内自持（本组件是通用 DSL 构件，不替代 chat 包 Composer）
