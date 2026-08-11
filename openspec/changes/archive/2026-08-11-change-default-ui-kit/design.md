# Design: change-default-ui-kit

## Context

pactor-app 三个 UI 槽位（componentRegistry / layoutRegistry / interactionKit）的内置默认目前为 antd 实现。决策：默认翻转为 Radix 套件。合并优先级机制（显式选项 > ui 预设 > 默认）不变，仅默认槽位取值变化。

约束：

- 交互核心（OverlayManager / createUiBridge / registerInteractionActions）来自 pactor-ui-antd 的 interaction 层且 antd 无关——pactor-app 保留对 pactor-ui-antd 的依赖，新增对 pactor-ui-radix 的依赖。
- 样式：Radix 无内建样式，默认路径必须导入 `pactor-ui-radix/styles.css`——文档显著提醒。

## Goals / Non-Goals

**Goals:**

- 三槽位默认翻转为 Radix；JSDoc 同步。
- 测试翻转（缺省断言 Radix；antd 由显式预设覆盖）。
- 文档同步。

**Non-Goals:**

- 不抽取交互核心到独立包（ui-radix → ui-antd 的依赖保持现状）。
- 不改 UiKit 类型与合并机制；不动两个 ui-* 包实现。

## Decisions

### D1: 默认值翻转

application.ts：`?? createBuiltinComponentRegistry()` → `?? createRadixComponentRegistry()`；layoutRegistry 与 interactionKit 同理。import 自 `pactor-ui-radix/components` / `/layout` / `/interaction` 子路径。

### D2: 依赖调整

pactor-app dependencies 增加 `pactor-ui-radix: workspace:*`（原 devDependency 移除/保留按 pnpm 规则去重）；保留 `pactor-ui-antd`（交互核心 + 类型）。antd 不再是默认路径的运行时依赖，但仍在 ui-antd 的 peer 链上——文档注明（彻底解耦需把交互核心下沉，另立项评估）。

### D3: 测试翻转

- shell-kit.test.tsx / 其他断言"缺省 antd"的用例：改为断言缺省 Radix（`.pcr-*` 存在、无 `.ant-*`）。
- ui-kit-antd.test.tsx（显式 `ui: antdUiKit`）保持不变。
- 注意 jsdom 查询差异：antd 按钮两汉字插空格（正则匹配），Radix 不插——缺省路径的按钮查询改用精确文本。

### D4: 文档

- app.md / ui-radix.md：默认即 Radix，样式导入为**必需步骤**；切回 antd 用 `ui: antdUiKit`。
- ui-antd.md：定位改为"显式选择 antd"。
- getting-started：默认说明与示例更新。

## Risks / Trade-offs

- [Radix 默认但未导入样式表时界面无样式] → 文档多处显著提醒；README 示例包含样式导入。
- [既有测试大量基于 antd 默认] → D3 翻转，全量测试为准绳。

## Migration Plan

框架未发布。直接翻转 + 全量测试 + 文档。

## Open Questions

- 交互核心（OverlayManager 等）下沉独立包以彻底解除 ui-radix → ui-antd 依赖：另立项评估。
