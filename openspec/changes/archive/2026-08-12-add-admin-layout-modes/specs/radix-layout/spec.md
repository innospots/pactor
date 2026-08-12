# Spec Delta: radix-layout（布局模式扩展）

## MODIFIED Requirements

### Requirement: RadixAdminLayout

SHALL 提供 `RadixAdminLayout`，props 契约复用 pactor-ui-antd（layout 层）的 `AdminLayoutProps`：Header（brand + headerExtra）/ Sidebar / 内容出口；config 开关（header/sidebar/tabs/breadcrumb/footer，缺省 header/sidebar 开）一致；菜单由 MenuRegistry 可见树渲染（group 可折叠、page/link 项、disabled），permissionChecker 时先过滤；选中态取 activeMenu；点击 page 经 bridge.push 导航，link/external 新窗口；Breadcrumb 按菜单链；Tabs 访问页签（去重、点击导航、关闭当前回退最后一个）。config `mode`（top-side/top-bottom/side-full/two-column）、`fixedHeader`/`fixedSider`、`collapsible`/`collapsed`、`breakpoint` 的结构与行为 SHALL 与 antd 版契约一致（样式经 styles.css `.pcr-*` class 与 `data-mode` 属性表达）。

#### Scenario: 菜单渲染与权限过滤

- **WHEN** 菜单树含 group 与 page，permissionChecker 判定某项无权限
- **THEN** 菜单渲染其余项，无权限项不出现

#### Scenario: activeMenu 高亮与导航

- **WHEN** route.activeMenu 为 'customer-list' 且点击 '/customers' 菜单项
- **THEN** customer-list 项呈选中态；bridge.push('/customers') 被调用

#### Scenario: Tabs 关闭当前回退

- **WHEN** tabs 开启，访问两页后关闭当前页签
- **THEN** 导航到剩余最后一个页签路径

#### Scenario: 布局开关

- **WHEN** config.sidebar 为 false
- **THEN** 不渲染 Sidebar

#### Scenario: 模式与收起

- **WHEN** config.mode 为 'two-column' 且 collapsible 为 true
- **THEN** 渲染两列侧边结构，trigger 点击切换收起态（与 antd 版语义一致）

#### Scenario: 响应式收起

- **WHEN** config.breakpoint 为 'lg' 且视口小于 992px
- **THEN** Sidebar 自动呈收起态
