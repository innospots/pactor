# Spec Delta: admin-layout（布局模式扩展）

## MODIFIED Requirements

### Requirement: 布局结构与开关

AdminLayout SHALL 渲染 Header / Sidebar / 内容区，并按 config 开关 `header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 控制各区域显隐（默认 header/sidebar 开，tabs/breadcrumb/footer 关）。内容区渲染 children。config `mode` SHALL 支持结构模式：`'top-side'`（缺省，顶部 header + 下方 sidebar/content）/ `'top-bottom'`（上-中-下，无 sidebar）/ `'side-full'`（sidebar 通栏全高居左，header+content 居右）/ `'two-column'`（侧边两列：一级菜单窄列 + 当前一级菜单的子菜单列）。antd 与 Radix 双实现的结构与行为契约 SHALL 一致。

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

## ADDED Requirements

### Requirement: 固定区域

config `fixedHeader` 为 true 时 Header SHALL 固定于视口顶部（内容滚动不跟随）；config `fixedSider` 为 true 时 Sidebar SHALL 固定且自身独立滚动。缺省均为 false。

#### Scenario: 固定顶部

- **WHEN** config.fixedHeader 为 true
- **THEN** Header 容器带固定定位样式（sticky/fixed），内容区独立滚动

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
