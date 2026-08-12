# Spec: radix-layout

Admin / Blank / Login / Landing 布局的 Radix 实现（`pactor-ui-radix` layout 层），与 pactor-ui-antd（layout 层，antd 版）契约一致。

### Requirement: RadixAdminLayout

SHALL 提供 `RadixAdminLayout`，props 契约复用 pactor-ui-antd（layout 层）的 `AdminLayoutProps`：Header（brand + headerExtra）/ Sidebar / 内容出口；config 开关（header/sidebar/tabs/breadcrumb/footer，缺省 header/sidebar 开）一致；菜单由 MenuRegistry 可见树渲染（group 可折叠、page/link 项、disabled），permissionChecker 时先过滤；选中态取 activeMenu；点击 page 经 bridge.push 导航，link/external 新窗口；Breadcrumb 按菜单链；Tabs 访问页签（去重、点击导航、关闭当前回退最后一个）。config `mode`（top-side/top-bottom/side-full/two-column）、`fixedHeader`/`fixedSider`（缺省 true，显式 false 关闭）、`collapsible`/`collapsed`、`breakpoint` 的结构与行为 SHALL 与 antd 版契约一致（样式经 styles.css `.pcr-*` class 与 `data-mode` 属性表达）。

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
### Requirement: Radix 基础布局

RadixBlankLayout（纯出口）、RadixLoginLayout（variant center/split + brand）、RadixLandingLayout（navbar/footer 插槽）SHALL 复用 pactor-ui-antd（layout 层）对应 props 类型，行为与 antd 版一致。

#### Scenario: Login split 变体

- **WHEN** 以 variant split 与 brand.title 渲染 RadixLoginLayout
- **THEN** 品牌区与 children 表单区并列呈现

### Requirement: 布局注册表

SHALL 提供 `createRadixLayoutRegistry()`（预注册 admin/blank/login/landing）与 `registerRadixLayouts(registry)`；类型名与 antd 版一致，`resolveLayout` 对 radix 注册表同样适用（未命中回退 Blank）。

#### Scenario: 类型名一致

- **WHEN** 比较 createRadixLayoutRegistry() 与 createLayoutRegistry() 的 list()
- **THEN** 均含 admin/blank/login/landing

### Requirement: 不依赖 antd

包 MUST NOT 依赖 antd；产物无 `from 'antd'` 引用；样式经 `styles.css`（`.pcr-*` class）提供且 exports 暴露。

#### Scenario: 依赖检查

- **WHEN** 检查 package.json 与构建产物
- **THEN** 无 antd 依赖与引用
