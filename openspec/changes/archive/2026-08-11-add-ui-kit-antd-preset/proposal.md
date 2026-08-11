# Proposal: add-ui-kit-antd-preset

## Why

add-ui-kit-preset 建立了 `ui` 预设机制并提供了 `radixUiKit`，但 antd 侧没有对称的聚合包——antd 三件套（pactor-components / pactor-interaction / pactor-layout）只是 pactor-app 的隐式默认。提供 `pactor-ui-antd` 聚合包与 `antdUiKit` 预设后：两个 UI 库 API 完全对称（`ui: antdUiKit` / `ui: radixUiKit`）；显式表达默认 kit 便于局部覆盖场景（`ui: antdUiKit` + 显式替换某一槽位）；聚合 re-export 也方便了直接使用各 antd 套件的业务方。

## What Changes

- 新增 `pactor-ui-antd` 聚合包（`packages/ui-antd`）：
  - re-export `pactor-components` / `pactor-interaction` / `pactor-layout` 的全部公开 API。
  - 导出 `antdUiKit` 预设对象：`{ componentRegistry: createBuiltinComponentRegistry, layoutRegistry: createLayoutRegistry, interactionKit: { Provider: InteractionProvider, OverlayHost } }`。
  - 无独立样式表（antd v5+ 为 CSS-in-JS，无需样式导入；README 注明）。
- **pactor-app**：无需改动（`ui?: UiKit` 已存在；增加一个 `ui: antdUiKit` 的对称性测试，devDependency 引入聚合包）。
- 文档站新增 pactor-ui-antd 模块页；ui-radix 页补充两者对称用法。

## Capabilities

### New Capabilities

- `ui-kit-antd-preset`: pactor-ui-antd 聚合包（re-export / antdUiKit 预设），与 radixUiKit 对称。

### Modified Capabilities

（无——pactor-app 的 `ui` 选项已具备，仅补对称测试。）

## Impact

- **新增代码**：`packages/ui-antd`；**修改**：`packages/app`（devDep + 1 个测试）。
- **无新第三方依赖**（聚合包只依赖三个 workspace antd 套件包）。
- **不修改**三个 antd 套件包的任何实现。
