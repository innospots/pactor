# Design: add-ui-kit-antd-preset

## Context

`ui?: UiKit` 机制与 `radixUiKit` 已就绪（add-ui-kit-preset）。antd 三件套是 pactor-app 内置默认，但没有聚合包与预设对象。本变更补齐对称性。

约束：

- 聚合包只做 re-export 与预设对象，不含新实现。
- 不修改三个 antd 套件包；pactor-app 仅加 devDep 与对称测试。
- antd v5+ 是 CSS-in-JS，无样式表入口（与 radix 侧差异，文档说明）。

## Goals / Non-Goals

**Goals:**

- `pactor-ui-antd`：`export *` 三包 + `antdUiKit`。
- app 层 `ui: antdUiKit` 对称性测试（渲染 antd 元素、无 `.pcr-*`）。
- 文档。

**Non-Goals:**

- 不把 pactor-app 的内置默认重构为引用 antdUiKit（避免 app → ui-antd 依赖环回；默认逻辑保持现状）。
- antd reset.css 聚合（业务可自行 `import 'antd/dist/reset.css'`，README 注明）。

## Decisions

### D1: 包结构

```
packages/ui-antd/
  package.json   # deps: pactor-components/pactor-interaction/pactor-layout workspace:*; peer: react >=18, antd >=5
  src/index.ts   # export * from 三包 + export const antdUiKit
```

`antdUiKit`：`{ componentRegistry: createBuiltinComponentRegistry, layoutRegistry: createLayoutRegistry, interactionKit: { Provider: InteractionProvider, OverlayHost } }`。类型用 pactor-app 的 `UiKit` 做编译期兼容断言（devDep）。

### D2: 测试

- ui-antd：关键符号可导入（createBuiltinComponentRegistry / OverlayHost / createLayoutRegistry）；antdUiKit 三槽位齐全；与 `UiKit` 类型的编译期兼容。
- app：`createPactorApplication({ ui: antdUiKit, ... })` 渲染 antd 元素（`.ant-*` 存在、`.pcr-*` 不存在）。

## Risks / Trade-offs

- [与 app 内置默认重复表达] → 接受：预设对象价值在显式与对称；文档说明不传 `ui` 时默认即 antd。

## Migration Plan

无（全新包）。顺序：包骨架 → index → 测试 → 文档。

## Open Questions

无。
