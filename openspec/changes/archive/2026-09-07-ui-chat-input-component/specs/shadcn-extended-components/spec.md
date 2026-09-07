# Delta: shadcn-extended-components

## ADDED Requirements

### Requirement: ChatInput 聊天输入组件

registry SHALL 注册 `ChatInput` 组件：AI 对话输入框的通用结构构件，嵌套两层结构——外层圆角容器（focus-within 高亮）内依次承载自适应高度 textarea、工具栏行与可选底部区（footer，带上分隔线）。组件 SHALL 提供 DSL props：`value`（受控值）/ `placeholder` / `disabled` / `rows`（最小行数）/ `hideSend`，以及槽位 props `toolbarStart` / `toolbarEnd`（DslNode，分别渲染在工具栏行左端与右端、内建发送钮之前）与 `footer`（DslNode，提供时渲染底部区）——工具栏与底部区内容完全由 DSL 自定义。组件 SHALL 内建圆形发送钮（空文本或 disabled 时禁用；`hideSend` 时省略）。视觉 MUST 只定义结构，颜色 MUST 消费 shadcn 语义令牌，MUST NOT 引入字面色值。

#### Scenario: 注册并渲染结构

- **WHEN** 页面 DSL 声明 `{ type: 'ChatInput', props: { placeholder: '今天帮你做些什么？' } }`
- **THEN** 渲染圆角容器内的多行输入区与工具栏行（含内建发送钮），placeholder 生效

#### Scenario: 槽位自定义

- **WHEN** props 提供 `toolbarStart` / `toolbarEnd` / `footer`（DslNode）
- **THEN** 分别渲染在工具栏行左端、右端（发送钮之前）与底部区（带上分隔线）

### Requirement: ChatInput 值与发送语义

`ChatInput` SHALL 支持受控（`value` + `onChange(value)`，变更只传出、显示值取自 props）与非受控（内部 state）两种模式；`onChange` 传出 string。`onSubmit(value)` SHALL 在点击发送钮或按下 Enter 时触发；Shift+Enter 换行不触发；IME 合成进行中 Enter MUST NOT 触发；trim 后为空白时 MUST NOT 触发且发送钮禁用；非受控模式发送后 SHALL 自动清空，受控模式的清空由调用方经 onSubmit 闭环处理。

#### Scenario: Enter 发送

- **WHEN** 输入文本后按 Enter
- **THEN** onSubmit 以该文本触发；非受控模式下输入框清空

#### Scenario: IME 与换行守卫

- **WHEN** IME 合成进行中按 Enter，或按 Shift+Enter
- **THEN** 均不触发 onSubmit（后者换行）

#### Scenario: 空文本禁发

- **WHEN** 输入为空白
- **THEN** 发送钮禁用，按 Enter 不触发 onSubmit

#### Scenario: 受控闭环

- **WHEN** DSL 以 `value: ${state.draft}` + `events.onChange → setState` 受控绑定
- **THEN** 输入经 setState 回写后正常显示，onSubmit 后组件不自行清空
