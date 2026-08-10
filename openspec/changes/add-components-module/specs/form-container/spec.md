# Spec: form-container

Form 容器协同：Form 内的字段自动成为表单项、提交事件、form 作用域（`pactor-components`）。

## ADDED Requirements

### Requirement: 字段自动包装

`Input` / `Select` 位于 Form 内且声明 `name` 时 MUST 自动包装为表单项（标签、校验规则生效）；不在 Form 内或未声明 `name` 时 MUST 渲染为独立控件，值来自 props，onChange 仅触发事件。

#### Scenario: Form 内字段成为表单项

- **WHEN** Form 的 children 含 `{ type: 'Input', props: { name: 'keyword', label: '关键词' } }`
- **THEN** 渲染带"关键词"标签的表单项

#### Scenario: 独立 Input

- **WHEN** Input 不在 Form 内，props 含 `value` 与 onChange 事件
- **THEN** 以受控值渲染，输入触发事件

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
