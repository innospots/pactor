# Spec: shell-ui-kit-selection

## Purpose

@pactor-app/app 的外壳层自定义覆盖点（layoutRegistry / interactionKit），与 componentRegistry 组合完成整站定制。内置实现为 `@pactor-app/ui`。

内置布局类型：admin / blank / login / landing / chat。admin 与 chat 布局经 app-shell 接收 `registry` / `bridge` / `route` / `permissionChecker`（菜单推导与导航用）；blank / login / landing 及业务自定义布局仅接收 `{ brand, children }`。

## Requirements

### Requirement: layoutRegistry 选项

`createPactorApplication` SHALL 支持可选 `layoutRegistry?: () => LayoutRegistry`：缺省使用 `createLayoutRegistry()`（来自 `@pactor-app/ui` 内置实现）。bootstrap 的 layout.type 解析逻辑不变。

#### Scenario: 缺省为内置布局

- **WHEN** 不传 layoutRegistry 启动 admin 布局应用
- **THEN** 外壳渲染为内置实现

### Requirement: chat 布局接线

bootstrap `layout.type: 'chat'` 时，app-shell SHALL 向布局组件传递 `brand` / `registry` / `bridge` / `route` / `permissionChecker`，内置 `ChatLayout` 据此推导菜单、导航与高亮。

#### Scenario: chat 布局渲染菜单

- **WHEN** bootstrap `layout.type: 'chat'` 且 menus 含若干 page 项
- **THEN** 外壳渲染 ChatLayout（Sidebar + 菜单），当前路径命中的菜单项高亮

### Requirement: interactionKit 选项

`createPactorApplication` SHALL 支持可选 `interactionKit?: { Provider, OverlayHost }`（props 类型为 `@pactor-app/ui/interaction` 的 `InteractionProviderProps` / `OverlayHostProps`）：缺省使用内置的 `InteractionProvider`/`OverlayHost`。

#### Scenario: 缺省为内置交互层

- **WHEN** 不传 interactionKit，执行 overlay.open 与 message 动作
- **THEN** overlay 与 toast 均为内置实现渲染
