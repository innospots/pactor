# Spec: ui-kit-selection

UI 库配置机制（`pactor-app` 扩展 + 独立使用方式）。内置实现唯一（shadcn，`pactor-ui`），覆盖点保留供业务自定义。


### Requirement: pactor-app componentRegistry 选项

`createPactorApplication` SHALL 支持可选 `componentRegistry?: () => Registry<unknown>`：缺省使用 shadcn 注册表（`createShadcnComponentRegistry`，来自 `pactor-ui`）——这是唯一内置实现；传入自定义工厂时叠加/替换生效。options.components 与运行期 registerComponent MUST 叠加在所选注册表之上。

#### Scenario: 缺省为 shadcn

- **WHEN** 不传 componentRegistry 与 ui 启动应用
- **THEN** 页面组件为 shadcn 实现

#### Scenario: 业务组件叠加

- **WHEN** 在所选注册表之上 options.components 注册自定义组件
- **THEN** DSL 可同时使用内置组件与该自定义组件

### Requirement: 独立使用方式

不经过 pactor-app 时 SHALL 可直接以 `createShadcnComponentRegistry()` 创建注册表，配合 pactor-runtime 使用。

#### Scenario: 手动注册渲染

- **WHEN** 手动创建 runtime 并注册后渲染 DSL
- **THEN** 组件以 shadcn 实现渲染
