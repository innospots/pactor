# Delta: layout-components

## MODIFIED Requirements

### Requirement: Layout 容器

`Layout` SHALL 渲染为 flex 容器：存在 `type: 'Sider'` 的直接子节点时主轴为 horizontal，否则为 vertical；`direction` prop 显式提供时 MUST 覆盖推导结果。children 经 Renderer children 机制渲染 DSL 子树。方向推导 MUST 跳过动态引用元素（DslSourceRef 无法静态判定是否为 Sider，混排数组中仅按内联元素推导；需要横向时显式声明 `direction`）。

#### Scenario: 含 Sider 子节点时横向排列

- **WHEN** Layout 的 children 为 `[Sider, Content]`
- **THEN** Sider 与 Content 在水平方向并列

#### Scenario: 无 Sider 时纵向排列

- **WHEN** Layout 的 children 为 `[Header, Content]`
- **THEN** Header 在上、Content 在下纵向排列

#### Scenario: 显式 direction 覆盖推导

- **WHEN** Layout 声明 `props: { direction: 'vertical' }` 且含 Sider 子节点
- **THEN** 子节点纵向排列

#### Scenario: 引用元素不参与方向推导

- **WHEN** Layout 的 children 为 `[{ source: {...} }, Content]`（引用内容实为 Sider）
- **THEN** 推导结果为 vertical（引用元素跳过）
