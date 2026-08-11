# Proposal: polish-example-admin

## Why

examples/admin 的页面虽然功能演示完整，但视觉单薄：平铺卡片、无视觉层次、无品牌感——作为框架的"门面"，示例的观感直接影响第一印象。本变更做一轮专项视觉打磨：重设计示例页面 DSL 的信息架构与层次、为示例增加自定义 theme.css（顺带成为换肤契约的实战演示）、并对默认皮肤做一轮细节微调。

## What Changes

- **示例页面重设计**（examples/admin/src/pages/*.page.yaml）：
  - dashboard：欢迎横幅区（突出品牌与用户信息）、指标卡行（更明确的数值层级）、双栏内容区（公告/待办 + 快捷操作——navigate 跳转演示）。
  - customer-list：查询区与表格区的层次优化、页面说明区。
  - customer-edit：表单页的层次与操作区。
- **示例级 theme.css**（examples/admin/src/theme.css）：覆盖若干 `--pcr-*` token 与结构性样式（如指标卡强调条），作为主题指南所述换肤契约的实战示例。
- **默认皮肤细节微调**（packages/ui-radix/styles.css，class 名与 DOM 结构不变）：Statistic 数值字号/字重层次、页面标题与内容区间距节奏、卡片 hover 质感、表格视觉密度等。
- playwright 截图对比验证（light + dark），主代理读图评审。
- 文档：主题指南提及 examples/admin/theme.css 作为参考实现。

## Capabilities

### New Capabilities

（无——视觉迭代，不产生新能力契约。）

### Modified Capabilities

- `example-admin`: 示例页面视觉重设计 + 自定义 theme.css（功能演示点不变）。
- `radix-theme`: 默认皮肤细节微调（token 契约与 class 结构不变）。

## Impact

- **修改**：examples/admin（页面 DSL + 新增 theme.css）、packages/ui-radix/styles.css（仅细节值调整）。
- **硬约束**：class 名 / DOM 结构 / 功能演示点 / 全部既有测试不变。
