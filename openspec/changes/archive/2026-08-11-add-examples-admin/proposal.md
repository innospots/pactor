# Proposal: add-examples-admin

## Why

框架 14 个包已齐备，但没有一个可跑的完整演示——设计文档第 7 节规划了 examples/，README 与文档也缺少"看一眼就知道长什么样"的入口。本变更落地 `examples/admin`：一个基于 pactor-app 的标准管理后台示例，串联 bootstrap 模拟、菜单/动态路由/权限、多页 DSL（本地 YAML + vite 插件加载）、服务 mock、Overlay 交互。同时作为工具链（pactor create 模板、pactor-vite-plugin、默认 Radix UI kit）的 dogfood 验证。

## What Changes

- 新增 `examples/admin`（包名 `example-admin`，private，加入 pnpm workspace）：
  - **启动方式**：`createPactorApplication` + `StaticDslLoader`（bootstrap 内联模拟，页面 DSL 用 `pactor-vite-plugin` 从 `src/pages/*.page.yaml` 导入）；默认 Radix UI kit + 样式导入。
  - **bootstrap 模拟**：app/user/permissions/menus（group + 隐藏详情页 + activeMenu）/layout（admin，tabs+breadcrumb 开启）。
  - **示例页面**（YAML DSL）：
    - `dashboard`（`/`）：Grid + Statistic + Alert + Tabs，展示表达式与数据绑定。
    - `customer-list`（`/customers`）：Form（keyword 查询）+ Table（service 数据源、cell 行模板按钮）+ overlay.open 抽屉编辑 + message + reload。
    - `customer-edit`（`/customers/:id/edit`，hidden）：route.params 注入、表单提交、navigate 返回。
    - `settings`（`/settings`，permission `system:admin` 未授予）：演示菜单权限过滤与 403。
  - **服务 mock**：内存 ServiceRegistry（customer.list / customer.detail / customer.update），无需后端。
  - **权限演示**：bootstrap permissions 不含 `customer:delete`——列表页删除按钮按 denied 策略（disabled）呈现。
  - vite dev 端口 5199；`pnpm --filter example-admin build` 可构建（验收手段）。
- 文档：getting-started 增加「示例工程」小节；README 工程结构补 examples。

## Capabilities

### New Capabilities

- `example-admin`: 可运行的管理后台示例——bootstrap 模拟、菜单/路由/权限演示、三个页面 DSL、服务 mock、可构建可启动。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`examples/admin`（workspace 成员，private 不发布）。
- **不修改**任何既有包；发现问题只能以 issues 形式记录（若暴露框架 bug 再单独修）。
- **V1 范围**：仅 admin 示例；chat / login / landing 示例后续按需补充。
