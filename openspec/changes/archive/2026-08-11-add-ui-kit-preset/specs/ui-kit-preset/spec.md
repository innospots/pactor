# Spec: ui-kit-preset

pactor-ui-radix 聚合包与 pactor-app `ui` 预设选项。

## ADDED Requirements

### Requirement: 聚合包 re-export

`pactor-ui-radix` SHALL re-export `pactor-components-radix`、`pactor-interaction-radix`、`pactor-layout-radix` 的全部公开 API，自身不含新实现。

#### Scenario: 关键符号可用

- **WHEN** 从 pactor-ui-radix 导入 createRadixComponentRegistry / RadixOverlayHost / createRadixLayoutRegistry
- **THEN** 均可正常导入并使用

### Requirement: radixUiKit 预设对象

SHALL 导出 `radixUiKit`，包含三个槽位：`componentRegistry`（createRadixComponentRegistry）、`layoutRegistry`（createRadixLayoutRegistry）、`interactionKit`（RadixInteractionProvider + RadixOverlayHost）。

#### Scenario: 预设形状

- **WHEN** 读取 radixUiKit
- **THEN** 三个槽位均存在，interactionKit 含 Provider 与 OverlayHost

### Requirement: 合并样式入口

SHALL 提供 `pactor-ui-radix/styles.css`（聚合三个套件样式表），exports 暴露该入口并标注 sideEffects。

#### Scenario: 样式入口

- **WHEN** 查看包 exports
- **THEN** 存在 `./styles.css`，且文件内容聚合三个套件的样式

### Requirement: pactor-app ui 选项

`createPactorApplication` SHALL 支持可选 `ui?: UiKit`（`{ componentRegistry?, layoutRegistry?, interactionKit? }`）。每个槽位的取值优先级 MUST 为：显式细粒度选项 > `ui` 预设 > 内置 antd 默认。不传 `ui` 时行为与现状完全一致。

#### Scenario: ui 预设整站生效

- **WHEN** 传入 `ui: radixUiKit` 启动并渲染页面、执行 overlay.open 与 message
- **THEN** 组件/布局/弹层/toast 均为 Radix 实现（`.pcr-*` 存在，无 `.ant-*`）

#### Scenario: 显式选项覆盖预设

- **WHEN** 传入 `ui: radixUiKit` 且显式传入自定义 `layoutRegistry`
- **THEN** 布局使用显式值，组件与交互层仍为 Radix 预设

#### Scenario: 不传 ui 行为不变

- **WHEN** 仅按既有方式传 api/loader
- **THEN** 组件/布局/交互层均为 antd 默认
