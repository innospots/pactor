# Spec: ui-kit-selection

UI 库切换配置机制（`pactor-app` 扩展 + 独立使用方式）。

## ADDED Requirements

### Requirement: pactor-app componentRegistry 选项

`createPactorApplication` SHALL 支持可选 `componentRegistry?: () => Registry<unknown>`：缺省使用 antd 内置注册表（行为与现状一致）；传入 `createRadixComponentRegistry` 时全部页面使用 Radix 实现。options.components 与运行期 registerComponent MUST 叠加在所选注册表之上。

#### Scenario: 缺省仍为 antd

- **WHEN** 不传 componentRegistry 启动应用
- **THEN** 页面组件为 antd 实现

#### Scenario: 切换 Radix

- **WHEN** 传入 `componentRegistry: createRadixComponentRegistry` 启动并渲染含 Button/Statistic 的页面
- **THEN** 渲染结果为 Radix 实现（语义 class 存在）

#### Scenario: 业务组件叠加

- **WHEN** 切换 Radix 注册表后 options.components 注册自定义组件
- **THEN** DSL 可同时使用 Radix 内置组件与该自定义组件

### Requirement: 独立使用方式

不经过 pactor-app 时 SHALL 可直接以 `createRadixComponentRegistry()` / `registerRadixComponents(registry)` 替换 antd 注册入口，配合 pactor-runtime 使用。

#### Scenario: 手动注册渲染

- **WHEN** 手动创建 runtime 并以 registerRadixComponents 注册后渲染 DSL
- **THEN** 组件以 Radix 实现渲染
