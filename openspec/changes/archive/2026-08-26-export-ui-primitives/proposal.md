# export-ui-primitives

## Why

pactor-chat 组件样式已自持，但 examples/chat 仍依赖 `app.css`：demo 的 8 个自定义组件（Header / CapabilityChip / ModelSelector / PlusMenu / AnchoredPopup / ContextChips / ContextPickerModal / MentionListbox，经 Chat 的 toolbar/header 槽注入）是手写 HTML + 私有 CSS——不引 app.css 时这些区域素顔（顶栏图标竖排、弹层以内联文本流瘫在页面底部）。宿主做自定义 UI 时无法复用 kit 的 vendored shadcn 原语（`src/ui/` 未公开导出），只能手写样式，视觉与 kit 脱节。

## What Changes

- `pactor-ui` 新增公开子路径入口 **`/ui`**：导出 vendored shadcn 原语组件（button/input/textarea/label/card/badge/alert/separator/skeleton/table/tabs/select/dialog/popover/accordion 等现有 `src/ui/` 全部导出符号），供宿主构建自定义 UI（槽位内容、业务组件），视觉自动跟随语义令牌皮肤。
- examples/chat 的 8 个自定义组件改用 `pactor-ui/ui` 原语重写（弹层用 Popover、模态用 Dialog、按钮/输入用 Button/Input 等），`app.css` 收缩为仅剩页面壳（`demo-app`/`demo-main` 高度链）与极少量无法避免的布局胶水；不引 app.css 时页面仍完整可用。
- 文档：docs/packages/ui.md 与 README 补 `/ui` 入口说明；docs 的 custom-components 指南提及自定义槽位 UI 推荐使用该入口。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ui-package-structure`: 子路径入口清单新增 `/ui`（vendored shadcn 原语公开导出）。
- `example-chat`: 自定义槽位 UI 改经 `pactor-ui/ui` 原语构建，不再依赖示例私有 CSS。

## Impact

- `packages/ui`：`src/ui/index.ts` 汇总导出（如未有）、package.json exports 加 `./ui`、tsup 入口、测试。
- `examples/chat`：components/ 8 个文件重写、app.css 瘦身。
- 无破坏性：纯新增入口；DSL 适配层（components/）不变。
