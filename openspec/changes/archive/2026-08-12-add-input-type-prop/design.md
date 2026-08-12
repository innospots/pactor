# Design: add-input-type-prop

## 决策

### D1：`type` 收敛为语义联合类型，而非自由 HTML type

`InputProps.type` 定义为 `'text' | 'password'`（缺省 `text`），不开放任意 HTML input type（number/email/...）。理由：DSL 是框架级协议，数字/日期等输入应以独立组件或校验规则演进，而非透传原生属性；当前只解决"密码掩码"这一确定需求，保持协议最小。

### D2：双 kit 各自的映射方式

- **antd**：`type === 'password'` 时渲染 `AntInput.Password`（自带可见性切换），否则 `AntInput`；Form 内表单项与独立控件两条渲染路径一致处理。
- **Radix**：把 `type` 落到 `<input>` 的 `type` 属性（`password` 时浏览器原生掩码）；Form 内（Radix Form Control）与独立路径一致。不引入额外可见性切换按钮，保持轻量。

### D3：契约单点定义

`InputProps` 仍只定义在 pactor-ui-antd components 层，pactor-ui-radix 复用该类型（既有依赖方向不变），保证双 kit 协议天然一致。

## 影响面

- `packages/ui-antd/src/components/components/Input/index.tsx`：新增 `type` prop 与 Password 分支。
- `packages/ui-radix/src/components/components/Input/index.tsx`：新增 `type` prop 透传。
- 测试：双 kit 各补 password 渲染与缺省行为用例。
- 无 breaking change（可选 prop，缺省行为不变）。
