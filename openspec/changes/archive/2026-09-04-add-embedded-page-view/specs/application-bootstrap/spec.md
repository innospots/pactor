# Delta: application-bootstrap

## ADDED Requirements

### Requirement: 两种使用形态共享组装内核

`@pactor-app/app` SHALL 提供两种使用形态：整应用模式（`createPactorApplication`，菜单驱动路由 + 外壳布局）与嵌入模式（`createPactorPage` / `PactorPage`，无路由、无外壳）。两种形态 MUST 共享同一套组装内核（registries / UI kit / 交互层 / i18n），同一份页面 DSL 在两种模式下渲染结果一致。

#### Scenario: 同一份 DSL 两种模式渲染一致

- **WHEN** 同一 PageDsl 分别经整应用模式（路由命中）与嵌入模式（PactorPage）渲染
- **THEN** 两种模式下页面内容与交互行为一致
