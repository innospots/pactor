# Spec Delta: radix-components

## ADDED Requirements

### Requirement: Input 输入类型（Radix 复现）

Radix Input SHALL 复现 builtin-components 的 `type` 语义：复用同一 `InputProps` 契约，`type: 'password'` 时原生 `<input>` 以 `type="password"` 渲染（Form 内外一致），缺省为文本输入；事件值语义不变（onChange 传 string）。

#### Scenario: 密码掩码渲染

- **WHEN** DSL 为 `{ type: 'Input', props: { name: 'password', type: 'password', label: '密码' } }` 置于 Form 内
- **THEN** 渲染出的 input 元素 `type` 属性为 `password`，输入内容掩码显示

#### Scenario: 缺省 text 与 antd 版一致

- **WHEN** 同一份未声明 type 的 Input DSL 分别以双 kit 渲染
- **THEN** 两者均为明文文本输入
