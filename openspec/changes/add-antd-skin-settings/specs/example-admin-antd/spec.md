# Spec Delta: example-admin-antd（皮肤设置）

## ADDED Requirements

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
