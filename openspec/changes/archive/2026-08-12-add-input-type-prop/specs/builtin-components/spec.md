# Spec Delta: builtin-components

## ADDED Requirements

### Requirement: Input 输入类型

Input SHALL 支持框架级 `type` prop，取值为 `'text' | 'password'`，缺省 `text`；`password` 时输入内容 MUST 以掩码呈现（Form 内表单项与独立控件行为一致）。DSL MUST NOT 直接暴露 antd 原生类型名以外的自由 HTML type。

#### Scenario: 缺省为文本输入

- **WHEN** DSL 为 `{ type: 'Input', props: { name: 'keyword' } }`（未声明 type）
- **THEN** 渲染普通文本输入框，输入内容明文可见

#### Scenario: Form 内密码输入

- **WHEN** Form 内 Input 配置 `{ name: 'password', label: '密码', type: 'password' }`
- **THEN** 渲染为密码输入框，输入内容以掩码显示，提交时 values.password 为实际字符串

#### Scenario: 独立密码输入

- **WHEN** Input 不在 Form 内且 props 含 `type: 'password'`
- **THEN** 渲染掩码输入框，onChange 仍传出 string 值
