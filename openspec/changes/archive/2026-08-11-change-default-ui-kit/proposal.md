# Proposal: change-default-ui-kit

## Why

框架的默认 UI 库目前是 antd（不传任何选项时 pactor-app 使用 antd 实现）。决策变更：**默认 UI kit 改为 Radix**——不传 `ui` / 细粒度选项时，组件、外壳布局、弹层与消息链路全部使用 Radix 实现；antd 转为显式选择（`ui: antdUiKit`）。这与框架"DSL 不绑定具体 UI Library"的定位一致：默认实现应是自有的轻量 Radix 套件，antd 作为企业级备选。

## What Changes

**BREAKING（默认行为变化；框架未发布，无外部影响）**：

- **pactor-app**：三个槽位的内置默认从 antd 翻转为 Radix：
  - `componentRegistry` 缺省 `createRadixComponentRegistry`（原 `createBuiltinComponentRegistry`）
  - `layoutRegistry` 缺省 `createRadixLayoutRegistry`（原 `createLayoutRegistry`）
  - `interactionKit` 缺省 `{ Provider: RadixInteractionProvider, OverlayHost: RadixOverlayHost }`
  - 合并优先级不变：显式细粒度选项 > `ui` 预设 > 内置默认（默认从 antd 变为 Radix）。
  - dependencies 增加 `pactor-ui-radix`；保留 `pactor-ui-antd`（交互核心 OverlayManager/UiBridge/动作注册与类型仍来自其 interaction 层）。
- **测试翻转**：原"缺省 antd"断言改为"缺省 Radix"；antd 路径由显式 `ui: antdUiKit` 测试覆盖（已有）。
- **文档**：默认变更说明 + **样式表提醒**（Radix 套件无内建样式，默认路径必须 `import 'pactor-ui-radix/styles.css'`，否则组件无样式）；ui-radix / ui-antd / app 模块页与快速开始同步。

## Capabilities

### New Capabilities

（无。）

### Modified Capabilities

- `ui-kit-selection`: componentRegistry 选项的缺省值从 antd 翻转为 Radix。
- `shell-ui-kit-selection`: layoutRegistry / interactionKit 选项的缺省值从 antd 翻转为 Radix。

## Impact

- **修改**：`packages/app`（默认值、dependencies、测试）、文档站。
- **不变**：合并优先级机制、`UiKit` 类型、两个聚合包的 API；antd 套件代码不动。
- **已知边界**：Radix 默认意味着用户必须导入 `pactor-ui-radix/styles.css`（bundler 无法自动注入 CSS）——文档显著位置说明。
