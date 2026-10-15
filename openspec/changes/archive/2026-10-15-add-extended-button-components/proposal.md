# Proposal: add-extended-button-components

## Why

`@pactor-app/ui` 目前只有基础 `Button` 与 `ButtonGroup`，缺少现代产品（如 AI 助手、编辑器、工具栏场景）常用的扩展按钮交互：复制确认、危险操作二次确认、分体式主操作、紧凑工具栏按钮等。参考 [arc-library](https://github.com/kuratlielia/arc-library#components) 的 Actions > Buttons 分组，将这些经过验证的交互形态引入 UI kit，供上层组件（chat、blocks）与 DSL 场景复用，避免各业务包各自重复实现。

## What Changes

在 `packages/ui/src/ui/` 新增 7 个扩展按钮组件（交互设计参考 arc-library，实现遵循本仓 shadcn/Base UI + cva + Tailwind 技术栈，不引入 arc 源码与 `motion` 依赖）：

- **ActionButton**：紧凑工具栏按钮（icon + 可选 label），适用于高频工具栏操作。
- **SplitButton**：主操作 + 下拉菜单备选操作的组合按钮，复用现有 DropdownMenu。
- **FloatingButtonGroup**：托盘式按钮组，共享高亮块在按钮间滑动，按下态原地确认。
- **ExpandingButtonGroup**：图标按钮组，悬停/聚焦的按钮展开显示文字标签，邻位按钮让位。
- **CopyButton**：复制值到剪贴板并即时反馈（复制图标 → 对勾，可自动还原）。
- **IconMorph**：图标在两种状态间形变切换（menu↔close、play↔pause、copy↔check 等预设对）。
- **ConfirmMorph**：危险操作按钮原地形变为内联确认 → 加载 → 结果反馈流程。

全部组件遵循既有约定：cva 变体、`data-slot` 属性、`cn()` 合并类名、lucide 图标、`size`/`variant` 与 Button 对齐，支持 `prefers-reduced-motion` 降级。

既有 `Button`、`ButtonGroup` 不改动（非 BREAKING）。

## Capabilities

### New Capabilities

- `extended-button-components`: `@pactor-app/ui` 的扩展按钮组件族（ActionButton / SplitButton / FloatingButtonGroup / ExpandingButtonGroup / CopyButton / IconMorph / ConfirmMorph）的 props 契约、变体与交互行为。

### Modified Capabilities

（无）

## Impact

- **代码**：`packages/ui/src/ui/` 新增 7 个组件文件；`packages/ui/src/ui/index.ts` 与包入口导出更新；新增测试。
- **构建**：`packages/ui` 的 `styles.css` 需重新预编译（Tailwind v4 扫描新类名）。
- **依赖**：不新增运行时依赖（动画用 CSS transition + tw-animate-css，复用现有 `@base-ui/react`、`lucide-react`）。
- **消费方**：doc 站组件目录可后续登记展示（不在本变更范围）；DSL 注册（`builtinComponents`）不在本变更范围。
