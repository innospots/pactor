# Spec: shell-ui-kit-selection

pactor-app 的外壳层 UI 库切换配置（layoutRegistry / interactionKit），与 componentRegistry 组合完成整站切换。

## MODIFIED Requirements

### Requirement: layoutRegistry 选项

`createPactorApplication` SHALL 支持可选 `layoutRegistry?: () => LayoutRegistry`：**缺省使用 Radix 版 `createRadixLayoutRegistry()`**；传入 `createLayoutRegistry`（或 `ui: antdUiKit`）时应用外壳使用 antd 布局。bootstrap 的 layout.type 解析逻辑不变。

#### Scenario: 缺省为 Radix 布局

- **WHEN** 不传 layoutRegistry 与 ui 启动 admin 布局应用
- **THEN** 外壳渲染为 Radix 实现（`.pcr-admin-*` 元素存在，无 `.ant-*` 元素）

#### Scenario: 切换 antd 布局

- **WHEN** 传入 `layoutRegistry: createLayoutRegistry` 或 `ui: antdUiKit`
- **THEN** 外壳为 antd AdminLayout

### Requirement: interactionKit 选项

`createPactorApplication` SHALL 支持可选 `interactionKit?: { Provider, OverlayHost }`（props 类型分别复用 pactor-ui-antd（interaction 层）的 `InteractionProviderProps` / `OverlayHostProps`）：**缺省使用 Radix 版 RadixInteractionProvider/RadixOverlayHost**；传入 antd 版（或 `ui: antdUiKit`）时 overlay/message/confirm 链路使用 antd 实现。

#### Scenario: 缺省为 Radix 交互层

- **WHEN** 不传 interactionKit 与 ui，执行 overlay.open 与 message 动作
- **THEN** overlay 与 toast 均为 Radix 实现渲染（`.pcr-modal-*` / `.pcr-toast-*` 存在）

#### Scenario: 切换 antd 交互层

- **WHEN** 传入 antd 版 interactionKit 或 `ui: antdUiKit` 执行 overlay.open
- **THEN** 渲染 antd Modal/Drawer
