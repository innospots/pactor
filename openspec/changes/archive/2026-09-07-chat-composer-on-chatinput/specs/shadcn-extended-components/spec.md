# Delta: shadcn-extended-components

## ADDED Requirements

### Requirement: ChatInput 顶部槽

`ChatInput` SHALL 提供 `header` 槽位 prop（DslNode，经 Renderer children 机制渲染）：提供时渲染在 textarea 上方的独立区域（与 `footer` 底部槽对称）；未提供时不渲染。该区域内容完全由 DSL 自定义（如附件卡片、上下文 chips 等输入上下文展示）。

#### Scenario: header 槽渲染

- **WHEN** props 提供 `header`（DslNode）
- **THEN** 其内容渲染在 textarea 上方、工具栏行之前

#### Scenario: 未提供不渲染

- **WHEN** 未提供 `header`
- **THEN** 不渲染顶部区域，结构退化为 textarea + 工具栏行（+ 可选 footer）
