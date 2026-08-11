# Spec: ui-kit-antd-preset

pactor-ui-antd 聚合包与 antdUiKit 预设（与 radixUiKit 对称）。

## ADDED Requirements

### Requirement: 聚合包 re-export

`pactor-ui-antd` SHALL re-export `pactor-components`、`pactor-interaction`、`pactor-layout` 的全部公开 API，自身不含新实现。

#### Scenario: 关键符号可用

- **WHEN** 从 pactor-ui-antd 导入 createBuiltinComponentRegistry / OverlayHost / createLayoutRegistry
- **THEN** 均可正常导入并使用

### Requirement: antdUiKit 预设对象

SHALL 导出 `antdUiKit`，包含三个槽位：`componentRegistry`（createBuiltinComponentRegistry）、`layoutRegistry`（createLayoutRegistry）、`interactionKit`（InteractionProvider + OverlayHost），且与 pactor-app 的 `UiKit` 类型编译期兼容。

#### Scenario: 预设形状与类型兼容

- **WHEN** 读取 antdUiKit 并将其赋值给 UiKit 类型
- **THEN** 三个槽位齐全，TypeScript 编译通过

### Requirement: 预设可用性

`createPactorApplication({ ui: antdUiKit })` SHALL 与不传 `ui` 的默认行为一致（antd 实现）。

#### Scenario: 显式 antd 预设

- **WHEN** 以 `ui: antdUiKit` 启动并渲染页面
- **THEN** 渲染 antd 元素（存在 `.ant-*`，不存在 `.pcr-*`）
