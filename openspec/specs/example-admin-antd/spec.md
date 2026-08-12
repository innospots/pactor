# Spec: example-admin-antd

antd UI kit 版管理后台示例工程（`examples/admin-antd`）：与 example-admin 共享同一 DSL，仅 `ui: antdUiKit` 不同。

### Requirement: 可启动可构建

`example-admin-antd` SHALL 为 pnpm workspace 成员（private）：`pnpm --filter example-admin-antd dev` 在 5299 端口启动 vite dev；`pnpm --filter example-admin-antd build` 构建成功（vite 插件构建期校验全部页面 YAML）。示例 MUST NOT 导致根级 `pnpm -r --if-present build/test/typecheck` 失败。

#### Scenario: 构建成功

- **WHEN** 执行 `pnpm --filter example-admin-antd build`
- **THEN** vite 构建成功，无校验错误

### Requirement: 同一 DSL 双 kit 运行

示例 SHALL 以 `ui: antdUiKit` 启动，页面 DSL（login / dashboard / customer-list / customer-edit）与 example-admin（Radix kit）内容一致；登录、查询、抽屉编辑回填、权限禁用等行为在 antd 渲染下 SHALL 与 Radix 版语义一致。

#### Scenario: antd 渲染登录页

- **WHEN** 未登录访问 `/` 被守卫跳转 `/login`
- **THEN** 渲染 antd 版 login 布局与表单，密码框为掩码输入

#### Scenario: 登录后进入 admin 布局

- **WHEN** 以演示账号 admin / pactor123 登录
- **THEN** 整页重载进入 antd admin 布局的工作台，菜单/页签/面包屑可用

#### Scenario: 抽屉编辑回填与权限禁用

- **WHEN** 打开客户列表行内"编辑"抽屉
- **THEN** antd 表单回填当前行数据；"删除"按钮因未授权呈禁用态
