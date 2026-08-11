# Spec: form-container

## MODIFIED Requirements

### Requirement: 字段自动包装

`Input` / `Select` 位于 Form 内且声明 `name` 时 MUST 自动包装为表单项（标签、校验规则生效）；不在 Form 内或未声明 `name` 时 MUST 渲染为独立控件，值来自 props，onChange 仅触发事件。Form 内字段的 `value` prop MUST 作为该字段初始值参与渲染（不再被忽略）。

#### Scenario: Form 内字段成为表单项

- **WHEN** Form 的 children 含 `{ type: 'Input', props: { name: 'keyword', label: '关键词' } }`
- **THEN** 渲染带"关键词"标签的表单项

#### Scenario: 字段级初始值

- **WHEN** Form 内 Input 配置 `name: 'name'` 与 `value: '云栖科技'`
- **THEN** 输入框初始显示"云栖科技"

#### Scenario: 独立 Input

- **WHEN** Input 不在 Form 内，props 含 `value` 与 onChange 事件
- **THEN** 以受控值渲染，输入触发事件

### Requirement: Form 初始值

Form SHALL 支持 `initialValues?: Record<string, unknown>` prop（可含表达式，如 `${params}`）：创建表单时作为字段初始值；字段级 `value` 与 `initialValues[name]` 同时存在时 MUST 以字段级为准。初始值 MUST 参与提交（未修改字段以初始值提交）与校验（required 以合并后的值判定）。双 kit（antd / Radix）行为 MUST 一致。

#### Scenario: initialValues 回填

- **WHEN** Form 配置 `initialValues: { phone: '13800000001' }` 且含 name 为 phone 的字段
- **THEN** 该字段初始显示 13800000001

#### Scenario: 初始值参与提交

- **WHEN** 表单有初始值字段且用户只修改其中一个字段就提交
- **THEN** onSubmit 的 values 包含全部初始值字段与修改后的值

#### Scenario: 字段级优先

- **WHEN** initialValues.name 为 'A' 且字段 value 为 'B'
- **THEN** 字段初始显示 'B'

#### Scenario: 双 kit 一致

- **WHEN** 同一份含 initialValues 的 Form DSL 分别以 antd 与 Radix kit 渲染
- **THEN** 两者均回填相同初始值
