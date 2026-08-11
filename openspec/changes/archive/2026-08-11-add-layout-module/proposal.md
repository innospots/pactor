# Proposal: add-layout-module

## Why

设计文档第 5、22–26 节：业务 DSL 只负责主内容区，应用外壳（Header/Sidebar/Menu/Tabs/Breadcrumb/Footer）由框架负责。V1 布局清单（第 98 节）为 login / admin / landing / chat / blank。目前菜单（pactor-router）、权限过滤（pactor-permission）、导航（NavigationBridge）都已就绪，但还没有把它们组装成应用外壳的一层。本变更落地 `pactor-layout`。

## What Changes

- 新增 `pactor-layout` 包（`packages/layout`），dependencies：`pactor-core` / `pactor-router` / `pactor-permission`（workspace:*）；peerDependencies：`react >=18`、`antd >=5`。
- **AdminLayout**（第 24 节）：
  - Header：logo / 标题 / 右侧插槽（用户信息、设置）。
  - Sidebar：由 MenuRegistry 可见树渲染 antd Menu；经 pactor-permission `filterMenusByPermission` 过滤；`selectedKeys` 取当前路由 `activeMenu`（隐藏详情页高亮列表页）；点击 page 项经 NavigationBridge 导航，link/external 项新窗口打开。
  - Breadcrumb：由 activeMenu 的菜单链推导（可开关）。
  - Tabs：访问过的页面页签（点击导航、可关闭，可开关；不做 keepAlive）。
  - 内容区：children（DSL 页面渲染出口）。
  - 配置对齐第 24 节：`header` / `sidebar` / `tabs` / `breadcrumb` / `footer` 开关。
- **基础布局**：`BlankLayout`（无外壳纯出口）、`LoginLayout`（brand 区块 + 表单出口，variant: center / split）、`LandingLayout`（navbar 插槽 + 内容区 + footer 插槽）。
- **LayoutRegistry**：layout type → 布局组件的注册表（复用 core Registry），`resolveLayout(type)` 获取组件，业务可注册自定义布局。
- 组件测试（jsdom + antd + MemoryNavigation）。
- 文档站新增 pactor-layout 模块页。

## Capabilities

### New Capabilities

- `admin-layout`: Header/Sidebar/Breadcrumb/Tabs/内容出口、菜单权限过滤与 activeMenu 高亮、导航集成、布局开关。
- `basic-layouts`: Blank / Login / Landing 布局与 LayoutRegistry 可扩展机制。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/layout`；不修改既有包。
- **V1 范围裁剪**：dashboard / workspace / split / master-detail / embedded 布局不做；chat 布局随 pactor-chat 落地；Tabs 不做 keepAlive；LoginLayout 不含认证逻辑（auth.login 动作归 pactor-app）。
- **后续模块**：pactor-app（bootstrap 的 layout 配置 → LayoutRegistry → AdminLayout + DynamicDslRoute 组合）。
