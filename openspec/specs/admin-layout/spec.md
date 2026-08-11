# Spec: admin-layout

AdminLayout：标准管理后台外壳（`pactor-ui-antd` layout 层，设计文档第 24 节）。

### Requirement: 布局结构与开关

AdminLayout SHALL 渲染 Header / Sidebar / 内容区，并按 config 开关 `header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 控制各区域显隐（默认 header/sidebar 开，tabs/breadcrumb/footer 关）。内容区渲染 children。

#### Scenario: 默认渲染

- **WHEN** 以 brand、registry、bridge、children 渲染 AdminLayout
- **THEN** 出现 Header（含品牌标题）、Sidebar、内容区含 children

#### Scenario: 关闭 sidebar

- **WHEN** config.sidebar 为 false
- **THEN** 不渲染 Sidebar

### Requirement: Sidebar 菜单渲染

Sidebar SHALL 由 MenuRegistry 可见树渲染 antd Menu：group 为子菜单、page/link 为菜单项、`disabled` 传递；提供 permissionChecker 时 MUST 先经权限过滤。

#### Scenario: group 与 page 渲染

- **WHEN** 菜单树含一个 group（两个 page 子项）与一个顶层 page
- **THEN** 菜单渲染子菜单与全部 page 项

#### Scenario: 权限过滤

- **WHEN** permissionChecker 判定某 page 无权限
- **THEN** 菜单中不出现该项

### Requirement: 菜单选中与导航

选中态 MUST 取当前路由的 `activeMenu`（隐藏详情页高亮其 activeMenu 指向的项）；点击 page 项 MUST 经 NavigationBridge 导航到其 path。

#### Scenario: activeMenu 高亮

- **WHEN** 当前 route 的 activeMenu 为 'customer-list'
- **THEN** 菜单中 customer-list 项为选中态

#### Scenario: 点击导航

- **WHEN** 点击 path 为 '/customers' 的菜单项
- **THEN** bridge.push('/customers') 被调用

### Requirement: Breadcrumb

breadcrumb 开启时 SHALL 按 activeMenu 的菜单链渲染面包屑（group → page）。

#### Scenario: 菜单链面包屑

- **WHEN** activeMenu 位于"客户管理/客户列表"链且 breadcrumb 开启
- **THEN** 面包屑显示 客户管理 / 客户列表

### Requirement: Tabs

tabs 开启时 SHALL 维护访问页签：导航到 page 项新增页签（去重），点击页签导航，closable 页签可关闭；关闭当前页签时导航到剩余最后一个页签。MUST NOT 承诺 keepAlive。

#### Scenario: 访问与切换页签

- **WHEN** 依次导航到两个页面
- **THEN** 出现两个页签，点击第一个页签触发导航回第一个页面

#### Scenario: 关闭当前页签

- **WHEN** 关闭当前所在页面的页签
- **THEN** 导航到剩余最后一个页签对应路径
