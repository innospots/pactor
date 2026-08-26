# Design: export-ui-primitives

## Context

examples/chat 的 8 个槽位自定义组件（Header / CapabilityChip / ModelSelector / PlusMenu / AnchoredPopup / ContextChips / ContextPickerModal / MentionListbox）是手写 HTML + app.css 私有样式。注释 app.css 后这些区域素顔（用户实测反馈"样式还是不对"）。根因：pactor-ui 的 vendored shadcn 原语（`src/ui/`）未公开导出，宿主做自定义 UI 只能用裸 HTML。

约束：原语层已在包内（vendored 源码），导出是 pure packaging；demo 重写 MUST 保持既有行为（回调签名、锚定定位、键盘交互、mock 数据流）。

## Goals / Non-Goals

**Goals:**

- `pactor-ui/ui` 子路径公开 vendored 原语组件；
- demo 槽位 UI 全部改经原语构建，无 app.css 时页面完整可用；
- 有 app.css 时视觉不回归。

**Non-Goals:**

- 不改 DSL 适配层（components/）与 12 组件契约；
- 不把 demo 的弹层定位逻辑换成 pactor-ui Popover 以外的自研方案——锚定交互若与 Popover 语义冲突，允许保留 demo 结构但视觉层（边框/圆角/底色/阴影）改用原语与令牌。

## Decisions

### D1：`/ui` 入口 = `src/ui/index.ts` 汇总 re-export

新增 `src/ui/index.ts` 按字母序 re-export 各 vendored 组件模块的公开符号（Button/buttonVariants、Input、Textarea、Label、Card 全家、Badge、Alert、Separator、Skeleton、Table 全家、Tabs、Select 全家、Dialog 全家、Popover、Accordion 全家等）；package.json exports 加 `./ui`（types/import/require 三条件，与 `/components` 同款），tsup entry 加 `src/ui/index.ts`。命名冲突（如 components 层的 Button 与 ui 层的 Button）不存在——`/ui` 是独立子路径，与 `/components` 的 DSL 适配器不同名导入路径。**备选**：主入口合并导出 —— 否决：符号冲突且污染主入口语义（主入口 = 三层公开 API + 预设）。

### D2：demo 组件重写映射

| demo 组件 | 原语方案 |
| --- | --- |
| Header（标题可编辑 + 图标按钮） | Button(variant=ghost/size=icon) + Input（编辑态） |
| CapabilityChip / ModelSelector / PlusMenu（chip + 锚定弹层） | Button(outline/sm) + Popover（替代自研 AnchoredPopup 定位；提及列表 MentionListbox 同为 Popover 内容） |
| ContextChips | Badge(secondary) + 可点移除 |
| ContextPickerModal | Dialog + 复选列表（原生 checkbox + Label） |

AnchoredPopup 若职责被 Popover 全覆盖则删除该文件。锚定坐标逻辑（trigger 元素 getBoundingClientRect）由 Popover 的 anchor 语义承担；确有不合拍处允许保留自研定位外壳，但视觉（边框/圆角/背景/阴影/字号）一律经原语与语义令牌表达，不回写手死颜色。

### D3：app.css 最终形态

仅保留：页面壳高度链（`html/body/#root`、`.demo-app`、`.demo-main`）、demo 主题令牌（`--demo-*` 中仍被引用的部分）、宿主 DSL 页面限宽规则（`[data-slot='page']`）。删除 demo-header/demo-icon-button/demo-chip/demo-popup/demo-modal/demo-picker 全部组件样式。

## Risks / Trade-offs

- [Popover 与 demo 弹层的交互细节差异（hover 触发、键盘上下选择）] → MentionListbox 的键盘导航在 Popover 内手工保持；逐一截图对比。
- [`/ui` 导出后宿主误用原语绕过 DSL 契约] → 文档明确：DSL 编排用 `/components` 适配器，自定义 React UI 用 `/ui` 原语。
- [app.css 删除样式导致既有 demo 截图基线变化] → 逐项截图对比验收。

## Migration Plan

纯新增入口 + 示例重写，无迁移。验证后随本次归档。
