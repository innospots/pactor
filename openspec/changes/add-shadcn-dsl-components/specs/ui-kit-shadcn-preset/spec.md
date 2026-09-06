# Spec Delta: ui-kit-shadcn-preset

## MODIFIED Requirements

### Requirement: 组件契约实现

`createShadcnComponentRegistry()` SHALL 注册与两既有 kit 完全一致的 20 个 DSL 类型名（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Table/Form/Input/Select/Layout/Header/Sider/Content/Footer/Menu/Link/Text）与 props 契约（契约类型 type-only 复用 `pactor-ui-antd/components`），事件值语义一致（Input.onChange → string、Select.onChange → value、Form.onSubmit → values 且写入 form 作用域、Table cell 经 renderChildren 带 row/rowIndex 作用域等）。此外 shadcn 注册表 SHALL 额外注册 `shadcn-extended-components` 定义的全部扩展类型，成为既有 kit 类型集合的超集。契约测试 SHALL 断言：`createShadcnComponentRegistry()` 包含 `createBuiltinComponentRegistry().list()` 的全部类型名且这 20 个类型行为一致（不再断言三 kit 注册表 list() 完全相等），并断言扩展类型全部可解析。

#### Scenario: 注册表超集

- **WHEN** 对比 shadcn 注册表与 builtin 注册表的 list()
- **THEN** shadcn 注册表包含 builtin 的全部 20 个类型名，且另含全部扩展组件类型

#### Scenario: 表单语义一致

- **WHEN** DSL 渲染 Form + Input（含 required rules）并提交
- **THEN** 校验拦截、onSubmit 携带 values、form 作用域写入与既有 kit 行为一致
