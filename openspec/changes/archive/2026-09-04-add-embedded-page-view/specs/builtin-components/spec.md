# Delta: builtin-components

## ADDED Requirements

### Requirement: Link 组件

内置组件目录 SHALL 新增 `Link`：`href`（可含表达式）/ `text` / `target` props，渲染原生 `<a>` 锚点；`_blank` 时 MUST 带 `rel="noreferrer"`；支持通用 props（`className` / `style`）。

#### Scenario: 渲染原生锚点

- **WHEN** DSL 声明 `{ type: 'Link', props: { text: '详情', href: '/items/1', target: '_blank' } }`
- **THEN** 渲染 `<a href="/items/1" target="_blank" rel="noreferrer">详情</a>`
