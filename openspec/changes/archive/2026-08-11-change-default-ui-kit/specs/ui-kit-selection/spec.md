# Spec: ui-kit-selection

UI 库切换配置机制（`pactor-app` 扩展 + 独立使用方式）。

## MODIFIED Requirements

### Requirement: pactor-app componentRegistry 选项

`createPactorApplication` SHALL 支持可选 `componentRegistry?: () => Registry<unknown>`：**缺省使用 Radix 注册表（`createRadixComponentRegistry`）**；传入 `createBuiltinComponentRegistry`（或 `ui: antdUiKit`）时使用 antd 实现。options.components 与运行期 registerComponent MUST 叠加在所选注册表之上。

#### Scenario: 缺省为 Radix

- **WHEN** 不传 componentRegistry 与 ui 启动应用
- **THEN** 页面组件为 Radix 实现（`.pcr-*` 语义 class 存在，无 `.ant-*`）

#### Scenario: 切换 antd

- **WHEN** 传入 `componentRegistry: createBuiltinComponentRegistry` 或 `ui: antdUiKit` 启动并渲染含 Button/Statistic 的页面
- **THEN** 渲染结果为 antd 实现

#### Scenario: 业务组件叠加

- **WHEN** 在所选注册表之上 options.components 注册自定义组件
- **THEN** DSL 可同时使用内置组件与该自定义组件

### Requirement: 独立使用方式

不经过 pactor-app 时 SHALL 可直接以 `createBuiltinComponentRegistry()`（antd）或 `createRadixComponentRegistry()`（Radix）创建注册表，配合 pactor-runtime 使用。

#### Scenario: 手动注册渲染

- **WHEN** 手动创建 runtime 并以任一注册入口注册后渲染 DSL
- **THEN** 组件以对应实现渲染
