# Delta: ui-kit-selection

## MODIFIED Requirements

### Requirement: pactor-app componentRegistry 选项

`createPactorApplication` SHALL 支持可选 `componentRegistry?: () => Registry<unknown>`：**缺省使用 shadcn 注册表（`createShadcnComponentRegistry`，来自 `pactor-ui`）**；传入 `createBuiltinComponentRegistry` / `createRadixComponentRegistry`（或 `ui: antdUiKit` / `ui: radixUiKit`）时使用对应实现。options.components 与运行期 registerComponent MUST 叠加在所选注册表之上。

#### Scenario: 缺省为 shadcn

- **WHEN** 不传 componentRegistry 与 ui 启动应用
- **THEN** 页面组件为 shadcn 实现（pactor-ui 语义 class 存在，无 `.ant-*` / `.pcr-*`）

#### Scenario: 切换 antd 或 radix

- **WHEN** 传入 `componentRegistry: createBuiltinComponentRegistry` / `createRadixComponentRegistry` 或对应 ui 预设启动并渲染含 Button/Statistic 的页面
- **THEN** 渲染结果为所选 kit 实现

#### Scenario: 业务组件叠加

- **WHEN** 在所选注册表之上 options.components 注册自定义组件
- **THEN** DSL 可同时使用内置组件与该自定义组件

### Requirement: 独立使用方式

不经过 pactor-app 时 SHALL 可直接以 `createBuiltinComponentRegistry()`（antd）、`createRadixComponentRegistry()`（Radix）或 `createShadcnComponentRegistry()`（shadcn）创建注册表，配合 pactor-runtime 使用。

#### Scenario: 手动注册渲染

- **WHEN** 手动创建 runtime 并以任一注册入口注册后渲染 DSL
- **THEN** 组件以对应实现渲染
