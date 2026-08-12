# Proposal: add-form-linkage

## Why

表单联动（如省/市级联）需要"字段 A 变化时清空/改写字段 B 的值"。当前 Form 的值托管在组件内部（antd Form 实例 / Radix Form 上下文），动作引擎无法触达，DSL 只能联动选项/禁用/显隐，不能联动字段值，级联场景旧值残留。

## What Changes

- `pactor-runtime`：RuntimeContext 新增 `forms` 注册表（kit 无关的 `FormHandle { setValues(values) }`，与 services/UiBridge 同模式）；内置动作新增 `form.setValues`（params: `form?` 缺省 `default`、`values` 表达式求值后下发）。
- `pactor-ui-antd` / `pactor-ui-radix`：Form 组件新增 `name` prop（缺省 `default`），挂载时向 `context.forms` 注册句柄、卸载注销；Radix Form 上下文补 `setValues(partial)` 方法。`setValues` 不触发校验、不触发 `onValuesChange`（避免循环）。
- 示例工程：客户编辑表单加 region/city 级联演示（双示例同一 DSL）。
- 文档：DSL 参考补 `form.setValues` 与联动写法。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `form-container`: 新增字段值联动能力（Form `name` 标识 + `form.setValues` 动作）。

## Impact

- 代码：`pactor-runtime`（context / builtins / 类型导出）、双 kit 的 Form 组件与上下文、各自测试。
- 协议：Form 新增可选 `name` prop；动作目录新增 `form.setValues`。向后兼容（不注册句柄时动作受控失败）。
- 下游：examples 双工程 DSL 增加级联演示；docs DSL 参考更新。
