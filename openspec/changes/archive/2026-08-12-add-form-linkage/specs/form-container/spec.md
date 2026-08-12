# Spec Delta: form-container

## ADDED Requirements

### Requirement: 字段值联动（form.setValues）

Form SHALL 支持可选 `name` prop（缺省 `default`），挂载时向 RuntimeContext 的 `forms` 注册表注册句柄、卸载注销。运行时 SHALL 提供内置动作 `form.setValues`：params `form`（缺省 `default`）指定目标表单、`values`（表达式求值后）合并写入表单字段值；目标句柄未注册时 MUST 返回 `{ ok: false, error }` 受控失败。setValues MUST NOT 触发校验与 `onValuesChange`（避免联动循环）。双 kit 行为 MUST 一致。`onValuesChange` 事件的 `event` 载荷为变化字段单键对象 `{ <field>: <newValue> }`。

#### Scenario: 级联清空

- **WHEN** 字段 A 的 onValuesChange 中执行 `form.setValues` 将字段 B 置空
- **THEN** 字段 B 显示为空，且不触发校验错误与 onValuesChange 回调

#### Scenario: 多表单按 name 寻址

- **WHEN** 页面含默认表单与 `name: edit` 的抽屉表单，`form.setValues` 指定 `form: edit`
- **THEN** 仅抽屉表单的字段被写入

#### Scenario: 句柄未注册受控失败

- **WHEN** `form.setValues` 指定的 form 名未注册
- **THEN** 动作返回 `{ ok: false, error }`，页面不崩溃

#### Scenario: 双 kit 一致

- **WHEN** 同一份级联 DSL 分别以 antd 与 Radix kit 渲染并触发联动
- **THEN** 两者目标字段值变化一致
