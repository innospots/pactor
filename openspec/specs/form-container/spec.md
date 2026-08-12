# Spec: form-container

Form 容器协同：Form 内的字段自动成为表单项、提交事件、form 作用域（`pactor-ui-antd` components 层）。

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

### Requirement: 校验规则

字段的 `rules` prop SHALL 映射到 antd 校验规则，至少支持 `required` 与 `message`；提交时校验失败 MUST 阻止提交并展示错误。

#### Scenario: required 校验

- **WHEN** 字段配置 `rules: [{ required: true, message: '必填' }]` 且未填写就提交
- **THEN** 显示"必填"错误，onSubmit 不触发

### Requirement: 提交事件与 form 作用域

Form SHALL 支持提交触发（DSL 中放置 `submit: true` 的 Button）；提交成功（校验通过）时 MUST 以 values 调用 onSubmit 事件，并把 values 写入 runtime state 的 `form` 路径，使 `${form.<field>}` 表达式可用。

#### Scenario: 提交触发 onSubmit

- **WHEN** 填写字段后点击 submit 按钮
- **THEN** onSubmit 动作执行，`event` 作用域为表单 values

#### Scenario: form 作用域可用

- **WHEN** 提交后页面某组件 props 引用 `${form.keyword}`
- **THEN** 该组件渲染提交的 keyword 值

### Requirement: Select 选项

Select SHALL 接受 `options` prop（`Array<{ label, value }>`，支持表达式解析），选中变化经 onChange 传出 value。

#### Scenario: 选项渲染与选择

- **WHEN** Select 配置两个 options 并选择其中一项
- **THEN** onChange 传出对应 value

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
