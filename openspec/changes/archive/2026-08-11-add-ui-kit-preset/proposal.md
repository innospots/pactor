# Proposal: add-ui-kit-preset

## Why

Radix 三套件（components-radix / interaction-radix / layout-radix）落地后，整站切换需要配置三个工厂选项 + 导入三个 styles.css，体验啰嗦且可能配出"半 antd 半 radix"的混搭。需要聚合包形式的预设：一次指定全部。同时坚持既有设计原则——pactor-app 不硬依赖任何具体 UI kit（字符串标识方案已被否决），`ui` 接受**对象**而非字符串，生态对第三方 kit 开放。

## What Changes

- 新增 `pactor-ui-radix` 聚合包（`packages/ui-radix`）：
  - re-export 三个 Radix 包的全部公开 API。
  - 导出 `radixUiKit` 预设对象：`{ componentRegistry, layoutRegistry, interactionKit: { Provider, OverlayHost } }`。
  - 合并样式入口 `pactor-ui-radix/styles.css`（聚合三个套件的样式表），一行导入。
- **pactor-app（扩展，向后兼容）**：`createPactorApplication` 新增 `ui?: UiKit` 选项；`UiKit = { componentRegistry?, layoutRegistry?, interactionKit? }`。优先级：**显式细粒度选项 > ui 预设 > 内置 antd 默认**——`ui` 提供整包预设，细粒度选项可局部覆盖。
- 测试：聚合包导出完整性与样式入口；app 层 `ui` 预设生效、显式选项覆盖、缺省不变。
- 文档：components-radix 的整站切换 recipe 改为以 `ui: radixUiKit` 为推荐路径（细粒度选项作为进阶）；新增 pactor-ui-radix 模块页。

## Capabilities

### New Capabilities

- `ui-kit-preset`: pactor-ui-radix 聚合包（re-export / radixUiKit / 合并样式）与 pactor-app `ui` 预设选项（优先级：显式选项 > 预设 > 默认）。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/ui-radix`；**修改**：`packages/app`（一个选项 + 优先级合并 + 测试）。
- **无新第三方依赖**（聚合包只依赖三个 workspace radix 包）。
- **不修改**三个 radix 包与 antd 版包；既有 `componentRegistry` / `layoutRegistry` / `interactionKit` 选项语义不变。
