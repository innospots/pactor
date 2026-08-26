# Delta: shell-ui-kit-selection

## MODIFIED Requirements

### Requirement: layoutRegistry 选项

`createPactorApplication` SHALL 支持可选 `layoutRegistry?: () => LayoutRegistry`：**缺省使用 shadcn 版 `createShadcnLayoutRegistry()`（来自 `pactor-ui`）**；传入 `createLayoutRegistry` / `createRadixLayoutRegistry`（或 `ui: antdUiKit` / `ui: radixUiKit`）时应用外壳使用对应布局实现。bootstrap 的 layout.type 解析逻辑不变。

#### Scenario: 缺省为 shadcn 布局

- **WHEN** 不传 layoutRegistry 与 ui 启动 admin 布局应用
- **THEN** 外壳渲染为 shadcn 实现（无 `.ant-*` / `.pcr-admin-*` 元素）

#### Scenario: 切换 antd 布局

- **WHEN** 传入 `layoutRegistry: createLayoutRegistry` 或 `ui: antdUiKit`
- **THEN** 外壳为 antd AdminLayout

### Requirement: interactionKit 选项

`createPactorApplication` SHALL 支持可选 `interactionKit?: { Provider, OverlayHost }`（props 类型分别复用 pactor-ui-antd（interaction 层）的 `InteractionProviderProps` / `OverlayHostProps`）：**缺省使用 shadcn 版 `ShadcnInteractionProvider`/`ShadcnOverlayHost`**；传入 antd 版 / Radix 版（或对应 ui 预设）时 overlay/message/confirm 链路使用对应实现。

#### Scenario: 缺省为 shadcn 交互层

- **WHEN** 不传 interactionKit 与 ui，执行 overlay.open 与 message 动作
- **THEN** overlay 与 toast 均为 shadcn 实现渲染

#### Scenario: 切换 antd 交互层

- **WHEN** 传入 antd 版 interactionKit 或 `ui: antdUiKit` 执行 overlay.open
- **THEN** 渲染 antd Modal/Drawer
