## Why

`@pactor-app/ui` 已具备 shadcn 语义令牌与暗色三态（light / dark / 跟随系统），但宿主应用无法在不重新构建 UI 包的前提下替换整套视觉皮肤。品牌方/企业客户需要"加载一个 CSS 文件即可换肤"的能力——覆盖背景、按钮色、圆角、各组件 hover/选中态、字体与文字颜色等，且覆盖后前景文字可读性不能失守。

## What Changes

- 定义**皮肤令牌契约**：在现有 shadcn 语义令牌基础上，整理并文档化一份完整的可覆盖 CSS 变量清单（背景、前景/文字、primary/secondary/destructive/禁用态、radius、popover/menu 的 hover 与选中背景、switch/slider/radio/progress/pagination 等组件级颜色、chart-1..5、calendar、sidebar 系列、字体族），组件实现中散落的硬编码颜色迁移到令牌。
- 定义**皮肤加载机制**：宿主通过 `<link rel="stylesheet">` 或运行时注入的样式表覆盖令牌；皮肤 CSS 在 `pactor-ui/styles.css` 之后加载即可生效，支持运行时切换（替换/增删皮肤样式表节点），无需重新构建。
- 页面背景支持纯色、渐变、图片三种形式（通过背景相关令牌承接，如 `--background` 与可选的 `--background-image`）。
- 暗色模式兼容：皮肤文件可按需同时提供 `:root` 与 `[data-pactor-theme='dark']`（及跟随系统媒体查询）两套令牌值；未提供暗色值时组件仍回退到内置暗色令牌。
- 前景可读性规则：所有背景类令牌均有对应的 `-foreground` 令牌，皮肤作者必须成对覆盖；文档给出对比度要求（WCAG AA）。
- 文档：docs 站点新增皮肤定制指南（令牌清单、皮肤文件示例、加载与运行时切换方式）。

## Capabilities

### New Capabilities

- `theme-skin-css`: 皮肤令牌契约与 CSS 皮肤文件的加载/切换机制——可覆盖令牌清单（含各组件 hover/选中/禁用态、chart、calendar、字体）、皮肤文件加载顺序与运行时切换规则、暗色模式下的皮肤行为、背景渐变/图片支持、前景文字可读性要求。

### Modified Capabilities

- `ui-package-structure`: 样式表职责扩展——`styles.css` 须保证全部组件颜色/圆角/阴影均经语义令牌解析（无硬编码颜色），使外部皮肤 CSS 可完整接管视觉。

## Impact

- **代码**：`packages/ui/src/styles.css`（令牌清单补全、组件样式去硬编码）、`packages/ui/src/ui/*` 与 `packages/ui/src/components/**`（个别硬编码颜色迁移到令牌）。
- **文档**：`docs/` 新增皮肤定制指南；`packages/ui` README/llms.txt 补充令牌契约说明。
- **兼容性**：纯增量——不覆盖皮肤时视觉与现状一致；无 API 破坏。
- **依赖**：无新增运行时依赖。
