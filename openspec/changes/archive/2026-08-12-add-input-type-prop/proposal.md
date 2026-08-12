# Proposal: add-input-type-prop

## Why

登录、改密等场景需要密码输入（掩码），当前双 kit 的 `Input` 组件只渲染纯文本输入框，DSL 无法表达"密码框"，登录示例只能以明文展示密码，框架能力存在明显缺口。

## What Changes

- `InputProps`（pactor-ui-antd components 层契约）新增可选 `type: 'text' | 'password'`，缺省 `text`。
- antd 实现：`type: 'password'` 时渲染 `Input.Password`（Form 内外一致）。
- Radix 实现：`<input>` 的 `type` 属性随 prop 输出，达到同等掩码效果。
- 双 kit 各补测试；示例工程的登录页将消费该能力（示例本身不在本变更范围）。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `builtin-components`: Input 组件新增 `type` 框架级 prop（text/password 掩码语义）。
- `radix-components`: Radix Input 复现 `type` 掩码语义，保持双 kit 契约一致。

## Impact

- 代码：`packages/ui-antd/src/components/components/Input/index.tsx`、`packages/ui-radix/src/components/components/Input/index.tsx` 及各自测试。
- 协议：`InputProps` 增加可选字段，向后兼容（缺省行为不变）。
- 下游：examples/admin 登录页使用 `type: password`。
