# Proposal: add-form-initial-values

## Why

示例暴露的框架空白：Form 内的字段无法回填现值——编辑场景（弹层/编辑页表单）是刚需。当前 pactor-ui-radix 的 Form 字段只读 `form.values[name]`，DSL 侧没有任何声明初始值的途径。本变更为 Form 增加初始值支持（双 kit 契约一致），并更新示例的编辑抽屉展示客户数据。

## What Changes

- **DSL 契约（双 kit 一致）**：
  - Form 新增 `initialValues?: Record<string, unknown>` prop——对象可含表达式（如 `${params}`），创建表单时作为初始值。
  - Form 内字段的 `value` prop 作为该字段的初始值（如 `value: ${params.name}`）；`initialValues[name]` 与字段 `value` 同时存在时字段级优先。
  - 初始值参与提交（未修改的字段以初始值提交）；`required` 校验把初始值视为已有值。
- **pactor-ui-radix**：Form 上下文初始化合并 initialValues 与字段 value；Input/Select 在 Form 内以初始值渲染。
- **pactor-ui-antd**：映射到 antd Form 的 `initialValues` / Form.Item `initialValue`，契约行为对齐。
- **示例更新**（examples/admin）：编辑抽屉表单回填 `${params.name}` / `${params.phone}` / `${params.level}`（customer-list 的 overlay params 同步补 phone/level）。
- 测试：两个 kit 的初始值渲染/提交/校验；示例构建通过；playwright 截图验证抽屉回填。

## Capabilities

### New Capabilities

（无。）

### Modified Capabilities

- `form-container`: 新增初始值需求（Form initialValues + 字段级 value 初始值）。
- `example-admin`: 编辑抽屉回填客户数据。

## Impact

- **修改**：packages/ui-radix（components 层 Form/Input/Select + 测试）、packages/ui-antd（components 层 Form + 测试）、examples/admin。
- **向后兼容**：未配置初始值的表单行为不变。
