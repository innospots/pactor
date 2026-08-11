# Design: add-ui-kit-preset

## Context

三个 Radix 套件包已落地，pactor-app 已有 `componentRegistry` / `layoutRegistry` / `interactionKit` 三个细粒度工厂选项。本变更提供聚合预设，改善整站切换体验。设计原则（已在讨论中确认）：`ui` 接受对象而非字符串；pactor-app 不硬依赖具体 kit；细粒度选项保留并可覆盖预设。

约束：

- pactor-ui-radix 只做聚合与 re-export，不含新实现。
- pactor-app 对 `UiKit` 类型的字段类型直接复用既有选项类型（结构一致）。
- 向后兼容：不传 `ui` 行为完全不变。

## Goals / Non-Goals

**Goals:**

- `pactor-ui-radix` 聚合包：`export *` 三包 + `radixUiKit` + 合并 `styles.css`。
- pactor-app `ui?: UiKit` 选项与优先级合并（显式 > 预设 > 默认）。
- 测试与文档。

**Non-Goals:**

- antd 侧的聚合包（antd 是内置默认，无需预设对象）。
- 样式自动注入（bundler 要求显式 import CSS）。
- 第三方 kit 的注册机制/市场——`UiKit` 是结构类型，天然开放，无需额外机制。

## Decisions

### D1: 聚合包结构

```
packages/ui-radix/
  package.json    # deps: 三个 radix 包 workspace:*; peer: react >=18
  styles.css      # @import 三个套件的样式表
  src/index.ts    # export * from 三包 + export const radixUiKit
```

- `radixUiKit`：`{ componentRegistry: createRadixComponentRegistry, layoutRegistry: createRadixLayoutRegistry, interactionKit: { Provider: RadixInteractionProvider, OverlayHost: RadixOverlayHost } }`。
- styles.css 用三条 `@import 'pactor-*/styles.css';`（Vite/主流 bundler 均支持解析包路径）；README 注明。
- exports：`.` + `./styles.css`；sideEffects 标注样式。

### D2: pactor-app `ui` 选项与优先级

```ts
interface UiKit {
  componentRegistry?: () => Registry<unknown>;
  layoutRegistry?: () => LayoutRegistry;
  interactionKit?: { Provider: ...; OverlayHost: ... };
}
interface PactorApplicationOptions {
  ui?: UiKit;
  componentRegistry?: ...;   // 既有
  layoutRegistry?: ...;      // 既有
  interactionKit?: ...;      // 既有
}
```

合并规则（每个槽位独立）：`options.<slot> ?? options.ui?.<slot> ?? <antd 默认>`。app 实例上暴露合并后的三个值供组合层使用。

### D3: 测试

- ui-radix：`radixUiKit` 形状断言（三个槽位齐全且为工厂/组件）；`export *` 关键符号可用（createRadixComponentRegistry 等）；styles.css 存在且 exports 暴露。
- app：`ui: radixUiKit` 后整站 Radix（复用 shell-kit 测试断言模式）；`ui` + 显式 `layoutRegistry` 覆盖时布局用显式值、其余槽位用预设；不传 `ui` 行为不变（既有测试天然覆盖）。

## Risks / Trade-offs

- [CSS @import 包路径依赖 bundler 解析] → 主流 bundler（Vite/webpack）均支持；README 注明若有不兼容可改为分别导入三个样式表。
- [`export *` 聚合放大包体积感知] → 聚合包本身无代码，tree-shaking 由 bundler 完成；peer 不重复声明 antd。
- [UiKit 与三个细粒度选项字段重复定义漂移] → UiKit 字段类型直接复用既有选项的类型（typeof/复用 interface），测试锁定优先级。

## Migration Plan

无（全新包 + 向后兼容选项）。顺序：聚合包 → app 选项 → 测试 → 文档。

## Open Questions

- 未来若 kit 增多，`ui` 槽位是否需要支持数组（多预设叠加）：暂不支持，第三方组合可自行合并对象。
