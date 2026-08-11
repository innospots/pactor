# Proposal: add-radix-theme

## Why

pactor-ui-radix 的样式表目前只是"可用的极简样式"——硬编码色值、无状态反馈细节、无暗色、无主题体系。作为框架的默认 UI kit，它需要一套美观的默认皮肤，并让用户能方便地换肤（用户已指明参考 Radix Colors 定制工具，主色 `#3C47DD`）。设计文档本就有 pactor-theme 规划，本变更先落地 Radix kit 的 token 化主题层。

## What Changes

- **重构 `packages/ui-radix/styles.css` 为 token 架构**（不新增运行时代码）：
  - **设计 token 层**：CSS 变量（`--pcr-*`）——色板（基于 Radix Colors 12 级刻度语义：accent `#3C47DD` 靛蓝、slate 中性、success/warning/error/info 语义色）、圆角、阴影、间距、字体、焦点环。
  - **默认皮肤（light）**：现代简洁风格——按钮 hover/active/disabled/focus-visible 全状态、卡片阴影、表格条纹/悬停、表单聚焦态、Modal/Drawer 开合动画（data-state）、Tabs 激活指示、菜单悬停/激活、Toast 语义色。
  - **暗色皮肤**：`[data-pactor-theme='dark']` 属性切换（挂在 html 或任意容器），完整覆盖全部 token。
  - **组件规则全部经由 `var(--pcr-*)` 取值**——class 名与 DOM 结构不变。
- **用户换肤契约**（三选一，文档化）：
  1. 覆盖 CSS 变量（推荐，可只改主色等少数 token）；
  2. `[data-pactor-theme='dark']` 启用内置暗色；
  3. 继续直接覆盖 `.pcr-*` class（向后兼容）。
  - 文档给出与 Radix Colors 定制工具（radix-ui.com/colors/custom）的配合方式：生成自定义主色的 light/dark 刻度后映射到 `--pcr-accent-*` 变量。
- **测试**：token 存在性与暗色块断言（样式表内容测试）；既有全部测试零回归（class 与 DOM 结构不变是硬约束）。
- **视觉验证**：用 playwright 对 examples/admin 关键页面截图确认默认皮肤观感。
- 文档站新增「主题定制」指南页；ui-radix 页更新样式章节。

## Capabilities

### New Capabilities

- `radix-theme`: token 化主题体系——默认 light 皮肤、内置 dark 皮肤、CSS 变量换肤契约。

### Modified Capabilities

- `radix-components`: 样式表由极简样式升级为 token 驱动的完整皮肤（class 名与 DOM 结构不变，行为 spec 不受影响）。

## Impact

- **修改**：`packages/ui-radix/styles.css`（重写）、其 README 与测试（新增 token 断言）。
- **零代码变更**：所有组件实现不动；全部既有测试应原样通过。
- **文档**：新增主题指南；examples/admin 作为视觉验证载体。
