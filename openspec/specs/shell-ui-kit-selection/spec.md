# Spec: shell-ui-kit-selection

pactor-app 的外壳层 UI 库切换配置（layoutRegistry / interactionKit），与 componentRegistry 组合完成整站切换。

### Requirement: layoutRegistry 选项

`createPactorApplication` SHALL 支持可选 `layoutRegistry?: () => LayoutRegistry`：缺省使用 antd 版 `createLayoutRegistry()`；传入 `createRadixLayoutRegistry` 时应用外壳使用 Radix 布局。bootstrap 的 layout.type 解析逻辑不变。

#### Scenario: 切换 Radix 布局

- **WHEN** 传入 `layoutRegistry: createRadixLayoutRegistry` 启动 admin 布局应用
- **THEN** 外壳渲染为 Radix 实现（`.pcr-admin-*` 元素存在，无 `.ant-*` 元素）

#### Scenario: 缺省仍为 antd

- **WHEN** 不传 layoutRegistry
- **THEN** 外壳为 antd AdminLayout（行为与现状一致）

### Requirement: interactionKit 选项

`createPactorApplication` SHALL 支持可选 `interactionKit?: { Provider, OverlayHost }`（props 类型分别复用 pactor-ui-antd（interaction 层）的 `InteractionProviderProps` / `OverlayHostProps`）：缺省使用 antd 版 InteractionProvider/OverlayHost；传入 Radix 版时 overlay/message/confirm 链路使用 Radix 实现。

#### Scenario: 整站 Radix 切换

- **WHEN** 同时配置 componentRegistry/layoutRegistry/interactionKit 为 Radix 实现，页面按钮执行 overlay.open（content 含文本）与 message 动作
- **THEN** overlay 与 toast 均为 Radix 实现渲染，链路行为不变

#### Scenario: 缺省仍为 antd 交互层

- **WHEN** 不传 interactionKit 执行 overlay.open
- **THEN** 渲染 antd Modal/Drawer（行为与现状一致）
