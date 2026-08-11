# Spec: example-admin

可运行的管理后台示例工程（`examples/admin`）。

### Requirement: 可启动可构建

`example-admin` SHALL 为 pnpm workspace 成员（private）：`pnpm --filter example-admin dev` 在 5199 端口启动 vite dev；`pnpm --filter example-admin build` 构建成功（vite 插件构建期校验全部页面 YAML）。示例 MUST NOT 导致根级 `pnpm -r --if-present build/test/typecheck` 失败。

#### Scenario: 构建成功

- **WHEN** 执行 `pnpm --filter example-admin build`
- **THEN** vite 构建成功，无校验错误

### Requirement: bootstrap 模拟与菜单路由

示例 SHALL 以内联 bootstrap（app/user/permissions/menus/layout）+ StaticDslLoader 启动：admin 布局开启 tabs 与 breadcrumb；菜单含 group、隐藏详情页（activeMenu 指向列表页）、未授权项（`system:admin` 未授予，菜单中被过滤）。

#### Scenario: 菜单权限过滤

- **WHEN** 启动示例查看侧边菜单
- **THEN** 无"系统设置"项（permissions 不含 system:admin）

#### Scenario: 隐藏详情页

- **WHEN** 访问 `/customers/1/edit`
- **THEN** 渲染编辑页且菜单高亮"客户管理"（activeMenu）

### Requirement: 示例页面

- **dashboard**（`/`）：欢迎横幅区（品牌渐变样式由 theme.css 承载）、4 张指标卡（Grid columns 4，含 accent 强调条）、双栏内容区（公告/待办 Tabs + 快捷操作 navigate 按钮组），含表达式绑定。
- **customer-list**（`/customers`）：页面说明区 + 查询区（Form submit → setState + reload）+ 数据区（Table service 数据源 + cell 行模板 + overlay.open 抽屉编辑，关闭成功后 if 分支 reload + message）+ 删除按钮按 denied 策略 disabled。
- **customer-edit**（`/customers/:id/edit`）：返回操作 + `${route.params.id}` 驱动详情数据源；提交后 navigate 回列表。

示例 SHALL 含 `src/theme.css`（在 `pactor-ui-radix/styles.css` 后导入）：token 覆盖与结构性美化（欢迎横幅、指标卡强调条），作为换肤契约的参考实现。

#### Scenario: 列表查询链路

- **WHEN** 在列表页输入关键词并提交查询表单
- **THEN** customers 数据源以新 keyword 重新加载

#### Scenario: 抽屉编辑链路

- **WHEN** 点击行内编辑、提交表单成功
- **THEN** drawer 关闭、列表 reload、出现成功 message

#### Scenario: 删除按钮禁用

- **WHEN** 查看列表行内删除按钮（DSL 配置 `permission: { code: 'customer:delete', denied: 'disabled' }`）
- **THEN** 按钮以禁用态呈现（permissions 不含 customer:delete）

#### Scenario: theme.css 存在且被导入

- **WHEN** 检查 examples/admin
- **THEN** 存在 src/theme.css 且在 pactor-ui-radix/styles.css 之后导入

#### Scenario: 视觉评审

- **WHEN** playwright 截图 dashboard 与 customer-list（light + dark）
- **THEN** 页面层次清晰（横幅/指标卡/内容区），评审通过

### Requirement: 服务 mock

示例 SHALL 提供内存 Service mock（customer.list / detail / update，带模拟延迟），经 `options.services` 注册，无需后端。

#### Scenario: 数据源经 mock 服务加载

- **WHEN** 打开列表页
- **THEN** 表格展示 mock 数据

### Requirement: 文档与说明

示例 SHALL 含 README（启动方式、演示点清单）；getting-started 增加示例工程小节；根 README 工程结构补 examples。

#### Scenario: README 演示点

- **WHEN** 阅读示例 README
- **THEN** 能找到启动命令与本 spec 各演示点说明
