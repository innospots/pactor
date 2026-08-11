# Spec: example-admin

## MODIFIED Requirements

### Requirement: 示例页面

- **dashboard**（`/`）：欢迎横幅区（品牌渐变样式由 theme.css 承载）、4 张指标卡（Grid columns 4，含 accent 强调条）、双栏内容区（公告/待办 Tabs + 快捷操作 navigate 按钮组），含表达式绑定。
- **customer-list**（`/customers`）：页面说明区 + 查询区（Form submit → setState + reload）+ 数据区（Table service 数据源 + cell 行模板 + overlay.open 抽屉编辑——**抽屉表单回填当前行的 name/phone/level（params 传递 + 字段级初始值）**，关闭成功后 if 分支 reload + message）+ 删除按钮按 denied 策略 disabled。
- **customer-edit**（`/customers/:id/edit`）：返回操作 + `${route.params.id}` 驱动详情数据源；提交后 navigate 回列表。

示例 SHALL 含 `src/theme.css`（在 `pactor-ui-radix/styles.css` 后导入）：token 覆盖与结构性美化（欢迎横幅、指标卡强调条），作为换肤契约的参考实现。

#### Scenario: 列表查询链路

- **WHEN** 在列表页输入关键词并提交查询表单
- **THEN** customers 数据源以新 keyword 重新加载

#### Scenario: 抽屉编辑链路

- **WHEN** 点击行内编辑、提交表单成功
- **THEN** drawer 关闭、列表 reload、出现成功 message

#### Scenario: 抽屉回填行数据

- **WHEN** 点击第一行（云栖科技）的编辑
- **THEN** 抽屉表单的客户名称字段初始显示"云栖科技"，联系电话与等级同样回填

#### Scenario: 删除按钮禁用

- **WHEN** 查看列表行内删除按钮（DSL 配置 `permission: { code: 'customer:delete', denied: 'disabled' }`）
- **THEN** 按钮以禁用态呈现（permissions 不含 customer:delete）

#### Scenario: theme.css 存在且被导入

- **WHEN** 检查 examples/admin
- **THEN** 存在 src/theme.css 且在 pactor-ui-radix/styles.css 之后导入

#### Scenario: 视觉评审

- **WHEN** playwright 截图 dashboard 与 customer-list（light + dark）
- **THEN** 页面层次清晰（横幅/指标卡/内容区），评审通过
