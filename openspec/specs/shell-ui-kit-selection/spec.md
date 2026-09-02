# Spec: shell-ui-kit-selection

@pactor/app 的外壳层 UI 配置（layoutRegistry / interactionKit），与 componentRegistry 组合完成整站定制。内置实现唯一（shadcn，`@pactor/ui`）。


### Requirement: layoutRegistry 选项

`createPactorApplication` SHALL 支持可选 `layoutRegistry?: () => LayoutRegistry`：缺省使用 `createShadcnLayoutRegistry()`（来自 `@pactor/ui`，唯一内置实现）。bootstrap 的 layout.type 解析逻辑不变。

#### Scenario: 缺省为 shadcn 布局

- **WHEN** 不传 layoutRegistry 与 ui 启动 admin 布局应用
- **THEN** 外壳渲染为 shadcn 实现

### Requirement: interactionKit 选项

`createPactorApplication` SHALL 支持可选 `interactionKit?: { Provider, OverlayHost }`（props 类型为 `@pactor/ui/interaction` 的 `InteractionProviderProps` / `OverlayHostProps`）：缺省使用 `ShadcnInteractionProvider`/`ShadcnOverlayHost`（唯一内置实现）。

#### Scenario: 缺省为 shadcn 交互层

- **WHEN** 不传 interactionKit 与 ui，执行 overlay.open 与 message 动作
- **THEN** overlay 与 toast 均为 shadcn 实现渲染
