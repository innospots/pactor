# Spec: ui-kit-preset

`@pactor-app/ui` 聚合包与 @pactor-app/app `ui` 预设选项。

### Requirement: 聚合包导出

`@pactor-app/ui` SHALL 导出其 components / interaction / layout 三层的全部公开 API（含收敛后自有的契约类型与交互核心），自身不含超出三层实现之外的新实现。

#### Scenario: 关键符号可用

- **WHEN** 从 @pactor-app/ui 导入 createShadcnComponentRegistry / ShadcnOverlayHost / createShadcnLayoutRegistry / OverlayManager
- **THEN** 均可正常导入并使用

### Requirement: shadcnUiKit 预设对象

SHALL 导出 `shadcnUiKit`，包含三个槽位：`componentRegistry`（createShadcnComponentRegistry）、`layoutRegistry`（createShadcnLayoutRegistry）、`interactionKit`（ShadcnInteractionProvider + ShadcnOverlayHost）。

#### Scenario: 预设形状

- **WHEN** 读取 shadcnUiKit
- **THEN** 三个槽位均存在，interactionKit 含 Provider 与 OverlayHost

### Requirement: 合并样式入口

SHALL 提供 `@pactor-app/ui/styles.css`（预建样式表），exports 暴露该入口并标注 sideEffects。

#### Scenario: 样式入口

- **WHEN** 查看包 exports
- **THEN** 存在 `./styles.css` 入口

### Requirement: @pactor-app/app ui 选项

`createPactorApplication` SHALL 支持可选 `ui?: UiKit`（`{ componentRegistry?, layoutRegistry?, interactionKit? }`）。每个槽位的取值优先级 MUST 为：显式细粒度选项 > `ui` 预设 > 内置 shadcn 默认。不传 `ui` 时行为与现状完全一致。

#### Scenario: ui 预设整站生效

- **WHEN** 传入 `ui: shadcnUiKit` 启动并渲染页面、执行 overlay.open 与 message
- **THEN** 组件/布局/弹层/toast 均为 shadcn 实现

#### Scenario: 显式选项覆盖预设

- **WHEN** 传入 `ui: shadcnUiKit` 且显式传入自定义 `layoutRegistry`
- **THEN** 布局使用显式值，组件与交互层仍为预设

#### Scenario: 不传 ui 行为不变

- **WHEN** 仅按既有方式传 api/loader
- **THEN** 组件/布局/交互层均为 shadcn 默认
