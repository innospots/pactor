# Delta: chat-dsl-component

## ADDED Requirements

### Requirement: Composer 槽配置

`Chat` SHALL 支持 `toolbarStart` / `toolbarEnd` / `composerFooter` props（`DslNode | ReactNode` 双型槽，与 sidebar / headerExtra 同款解析）：分别渲染在聊天输入框的工具栏左端、工具栏右端（发送钮之前）与 footer 区域；DslNode 槽经 renderChildren 渲染（仅页面运行时内），纯 React 使用时对应 props SHALL 接受 ReactNode。`ChatServices` 可经同名服务注入（ReactNode）；服务槽与 props 槽并存时服务槽在先。

#### Scenario: DSL 声明槽位

- **WHEN** 页面 DSL 的 Chat 节点配置 toolbarStart / toolbarEnd / composerFooter（DslNode）
- **THEN** 对应内容渲染在输入框的工具栏左端、右端与 footer 区域

#### Scenario: 服务槽与 props 槽合并

- **WHEN** ChatServices 与 props 同时提供同名槽
- **THEN** 服务槽内容在前、props 槽内容在后，共同渲染
