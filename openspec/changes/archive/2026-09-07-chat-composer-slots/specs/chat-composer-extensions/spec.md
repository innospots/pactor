# Delta: chat-composer-extensions

## ADDED Requirements

### Requirement: Composer footer 槽

Composer SHALL 支持 `composerFooter` 槽：渲染在工具栏下方的独立区域（带分隔线，结构与 ChatInput 的 footer 区一致）；未提供时 MUST NOT 渲染该区域（DOM 与既有行为一致）。fallback 与 DSL 双路径 SHALL 结构一致；DSL 路径经 ChatInput 的 `footer` 槽承载。

#### Scenario: footer 渲染

- **WHEN** 提供 composerFooter 内容
- **THEN** 渲染在工具栏下方、以分隔线相隔

#### Scenario: 未提供不渲染

- **WHEN** 未提供 composerFooter
- **THEN** 不渲染 footer 区域，DOM 与既有行为一致
