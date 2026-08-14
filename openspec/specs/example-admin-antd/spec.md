# Spec: example-admin-antd

antd UI kit 版管理后台示例工程（`examples/admin-antd`）：与 example-admin 共享同一页面结构与 bootstrap 形态，`ui: antdUiKit` 渲染；额外接入皮肤设置与中英文国际化。

### Requirement: 可启动可构建

`example-admin-antd` SHALL 为 pnpm workspace 成员（private）：`pnpm --filter example-admin-antd dev` 在 5299 端口启动 vite dev；`pnpm --filter example-admin-antd build` 构建成功（vite 插件构建期校验全部页面 YAML）。示例 MUST NOT 导致根级 `pnpm -r --if-present build/test/typecheck` 失败。

#### Scenario: 构建成功

- **WHEN** 执行 `pnpm --filter example-admin-antd build`
- **THEN** vite 构建成功，无校验错误

### Requirement: 同一 DSL 结构双 kit 运行

示例 SHALL 以 `ui: antdUiKit` 启动，页面 DSL（login / dashboard / customer-list / customer-edit）的组件结构、数据源与动作链和 example-admin（Radix kit）一致；登录、查询、抽屉编辑回填、权限禁用等行为在 antd 渲染下 SHALL 与 Radix 版语义一致。文案层面 antd 版经 `${t()}` 表达式接入 i18n（Radix 版为硬编码中文），两者文案实现允许不同。

#### Scenario: antd 渲染登录页

- **WHEN** 未登录访问 `/` 被守卫跳转 `/login`
- **THEN** 渲染 antd 版 login 布局与表单，密码框为掩码输入

#### Scenario: 登录后进入 admin 布局

- **WHEN** 以演示账号 admin / pactor123 登录
- **THEN** 整页重载进入 antd admin 布局的工作台，菜单/页签/面包屑可用

#### Scenario: 抽屉编辑回填与权限禁用

- **WHEN** 打开客户列表行内"编辑"抽屉
- **THEN** antd 表单回填当前行数据；"删除"按钮因未授权呈禁用态

### Requirement: 皮肤设置面板

示例 SHALL 在 admin 头部提供皮肤设置入口（按钮 → Drawer）：主色预设与自定义取色、暗黑模式开关、圆角调节；设置 SHALL 实时生效（无需刷新）并经 localStorage 持久化（刷新后保持）。

#### Scenario: 切换主色

- **WHEN** 在皮肤面板选择另一主色
- **THEN** 按钮、菜单高亮等主色元素即时变色

#### Scenario: 暗黑模式

- **WHEN** 打开暗黑模式开关
- **THEN** 应用整体切换为暗色主题（antd darkAlgorithm）

#### Scenario: 持久化

- **WHEN** 修改皮肤设置后刷新页面
- **THEN** 皮肤保持为修改后的值

### Requirement: 中英文切换

示例 SHALL 在 admin 头部提供语言切换入口（中文 / English）：语言偏好经 localStorage 持久化，切换后整页刷新，刷新后 options.locale、bootstrap 菜单/应用名文案、页面 DSL 的 `${t()}` 表达式与 antd ConfigProvider locale 均按新语言渲染。

#### Scenario: 切换为英文

- **WHEN** 在语言切换下拉选择 English
- **THEN** 页面刷新后菜单、页面文案与 antd 组件内置文案（分页、空态等）均显示英文

#### Scenario: 语言偏好持久化

- **WHEN** 切换语言后再次打开或刷新页面
- **THEN** 页面按上次选择的语言渲染
