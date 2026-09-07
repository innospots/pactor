# Spec: admin-layout

## Purpose

AdminLayout：标准管理后台外壳（`pactor-ui-antd` layout 层，设计文档第 24 节）。


## Requirements

### Requirement: 布局结构与开关

AdminLayout SHALL 渲染 Header / Sidebar / 内容区，并按 config 开关 `header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 控制各区域显隐（默认 header/sidebar 开，tabs/breadcrumb/footer 关）。内容区渲染 children。config `mode` SHALL 支持结构模式：`'top-side'`（缺省，顶部 header + 下方 sidebar/content）/ `'top-bottom'`（上-中-下，无 sidebar）/ `'side-full'`（sidebar 通栏全高居左，header+content 居右）/ `'two-column'`（侧边两列：一级菜单窄列 + 当前一级菜单的子菜单列）。

#### Scenario: 默认渲染

- **WHEN** 以 brand、registry、bridge、children 渲染 AdminLayout
- **THEN** 出现 Header（含品牌标题）、Sidebar、内容区含 children

#### Scenario: 关闭 sidebar

- **WHEN** config.sidebar 为 false
- **THEN** 不渲染 Sidebar

#### Scenario: 上-中-下模式

- **WHEN** config.mode 为 'top-bottom'
- **THEN** 渲染 Header + 内容区（无 Sidebar），footer 开关生效

#### Scenario: 通栏侧边模式

- **WHEN** config.mode 为 'side-full'
- **THEN** Sidebar 全高居左（含品牌区），Header 与内容区居右

#### Scenario: 两列侧边模式

- **WHEN** config.mode 为 'two-column' 且菜单树含 group
- **THEN** 第一列渲染一级菜单，选中 group 时第二列渲染其子菜单

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

### Requirement: 固定区域

config `fixedHeader` 为 true 时 Header SHALL 固定于视口顶部（内容滚动不跟随）；config `fixedSider` 为 true 时 Sidebar SHALL 固定且自身独立滚动。**缺省均为 true**（贴合管理后台主流形态）；显式配置 false 关闭。

#### Scenario: 固定顶部

- **WHEN** config.fixedHeader 为 true
- **THEN** Header 容器带固定定位样式（sticky/fixed），内容区独立滚动

#### Scenario: 缺省固定

- **WHEN** 未配置 fixedHeader / fixedSider
- **THEN** Header 与 Sidebar 均呈固定态

#### Scenario: 显式关闭

- **WHEN** config.fixedHeader 为 false
- **THEN** Header 不固定，随内容滚动
### Requirement: 收起侧边栏

config `collapsible` 为 true 时 Sidebar SHALL 提供收起/展开 trigger；收起态宽度收窄（菜单文字隐藏）；`collapsed` 指定初始收起状态。缺省不收起、无 trigger。

#### Scenario: 收起与展开

- **WHEN** collapsible 为 true 时点击 trigger
- **THEN** Sidebar 在展开/收起宽度间切换

#### Scenario: 初始收起

- **WHEN** collapsible 且 collapsed 为 true
- **THEN** 首次渲染即为收起态

### Requirement: 响应式收起

config `breakpoint`（xs/sm/md/lg/xl/xxl）指定后，视口宽度小于断点时 Sidebar SHALL 自动收起，大于断点时恢复配置态。

#### Scenario: 小于断点自动收起

- **WHEN** breakpoint 为 'lg' 且视口宽度 800px
- **THEN** Sidebar 呈收起态
