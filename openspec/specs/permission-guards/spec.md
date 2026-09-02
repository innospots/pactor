# Spec: permission-guards

Menu / Page / Component 三层权限守卫（`@pactor-app/permission` 纯函数 + @pactor-app/runtime Renderer 集成）。

### Requirement: 权限配置统一解析

SHALL 提供纯函数把三种 `PermissionConfig` 形态（string / string[] / `{ code, denied }`）归一为 `{ allowed, denied }`：数组按 hasAny；`denied` 缺省为 `'hidden'`；未配置 permission 视为放行。

#### Scenario: 各形态归一

- **WHEN** 分别以 string、string[]、对象形式检查有权限与无权限的码
- **THEN** allowed 判定正确；对象形式未指定 denied 时返回 `'hidden'`

### Requirement: Menu Guard

`filterMenusByPermission(menus, checker)` SHALL 递归移除无权限的菜单项；无权限且 children 被全部移除的目录项 MUST 一并移除；未配置 permission 的项保留。原数组 MUST NOT 被修改。

#### Scenario: 递归过滤菜单

- **WHEN** 菜单含 `permission: 'strategy:view'` 的项与含无权限子项的目录
- **THEN** 无权限项被移除，空目录被移除，其余保留且原数组不变

### Requirement: Page Guard

`checkPagePermission(page, checker)` SHALL 在页面元信息含 permission 时判定是否放行；无 permission 字段 MUST 放行。

#### Scenario: 页面权限判定

- **WHEN** page 配置 `permission: 'strategy:view'` 且 checker 判定无权限
- **THEN** 返回 false；page 无 permission 字段时返回 true

### Requirement: Component Guard（Renderer 集成）

@pactor-app/runtime 的 Renderer SHALL 在渲染节点前检查 `node.permission`：无权限时按 denied 策略处理——`hidden` 渲染 null、`disabled` 给组件注入 `disabled: true` prop、`readonly` 注入 `readOnly: true` prop；有权限或未配置 permission 时行为不变。权限注入的 prop MUST 优先于 DSL props 中的同名字段。

#### Scenario: 默认隐藏

- **WHEN** Button 配置 `permission: 'customer:edit'` 且 adapter 判定无权限
- **THEN** 该 Button 不出现在渲染结果中

#### Scenario: disabled 策略

- **WHEN** Button 配置 `permission: { code: 'customer:edit', denied: 'disabled' }` 且无权限
- **THEN** Button 渲染且收到 `disabled: true`（即使 DSL props 中 disabled 为 false）

#### Scenario: 有权限正常渲染

- **WHEN** 节点配置 permission 且 adapter 判定有权限
- **THEN** 组件正常渲染，无额外注入

#### Scenario: 默认适配器行为不变

- **WHEN** 使用 @pactor-app/runtime 默认 PermissionAdapter（放行）
- **THEN** 配置 permission 的节点照常渲染
