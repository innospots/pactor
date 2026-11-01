---
name: Pactor UI & Blocks
description: shadcn 语义令牌体系上的 DSL 组件库——中性、可换肤、扁平优先
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  success: "oklch(0.696 0.17 162.48)"
  warning: "oklch(0.769 0.188 70.08)"
  info: "oklch(0.623 0.214 259.815)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.85 0 0)"
  ring: "oklch(0.556 0 0)"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "calc(var(--radius) * 0.6)"
  md: "calc(var(--radius) * 0.8)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) * 1.4)"
spacing:
  flex-gap: "12px"
  grid-gap: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
---

# Design System: Pactor UI & Blocks

## Overview

**Creative North Star: "The Skin-Ready Instrument"**

Pactor UI 是一套刻意中性的工具型组件库：shadcn 语义令牌（OKLCH 灰阶）做基线，
视觉性格被有意压到 token 层之下，把「性格」让给皮肤（skin）与业务页面。
它不是拿来展示的视觉系统，而是一台随时可以被换肤的仪器——所有颜色、圆角、
阴影、字体都经 CSS 自定义属性解析，皮肤文件在样式表之后加载即可整体改写。

组件层是「适配器」而非「原语」：每个组件把稳定的 DSL props 契约（antd 风格
variant 命名）映射到 vendored shadcn/Base UI 实现，视觉忠实于 shadcn 基线，
差异化全部沉淀在契约与令牌体系里。

**Key Characteristics:**
- 中性灰阶 OKLCH 令牌，亮色近白 / 暗色近黑双主题，三态切换（light / dark / 跟随系统）
- 扁平优先：阴影默认关闭，深度靠边框与色调分层表达
- 一切可换肤：语义令牌 + 组件级令牌（--<component>-<part>-<state>）双层契约
- DSL 契约优先：props 命名对齐 antd 习惯，视觉实现可对齐 shadcn 迭代

## Colors

调色板是无彩灰阶 + 四个状态补充色；彩度只出现在语义状态与图表里，灰阶承载全部界面结构。

### Primary
- **Ink**（oklch(0.205 0 0)，暗色反转为 oklch(0.922 0 0)）：主按钮、选中态、进度指示。近黑而非纯黑，暗色主题下反转为近白——primary 是「最重的中性色」，不是品牌色。

### Neutral
- **Paper**（oklch(1 0 0)，暗色 oklch(0.145 0 0)）：页面背景。
- **Panel**（oklch(1 0 0)，暗色 oklch(0.205 0 0)）：card / popover 表面，暗色下比背景浅半阶，形成无阴影的分层。
- **Whisper**（oklch(0.97 0 0)，暗色 oklch(0.269 0 0)）：muted / secondary / accent 共用的浅灰填充，hover 与弱强调的唯一灰。
- **Ash**（oklch(0.556 0 0)，暗色 oklch(0.708 0 0)）：次要文字 muted-foreground。
- **Hairline**（oklch(0.922 0 0)，暗色 10% 白）：边框与输入框描边。

### Semantic（Alert 四态与状态徽标）
- **Signal Red**（oklch(0.577 0.245 27.325)）：destructive，危险操作与错误。
- **Verdant**（oklch(0.696 0.17 162.48)）：success。
- **Amber**（oklch(0.769 0.188 70.08)）：warning。
- **Cerulean**（oklch(0.623 0.214 259.815)）：info。

### Named Rules
**The Skin Authority Rule.** 任何组件颜色必须来自语义令牌或组件级令牌（var()），禁止硬编码 hex/oklch 字面值进组件。皮肤在样式表之后加载即拥有最终裁量权。

**The One Accent Rule.** 界面结构色只有灰阶；彩度只属于语义状态（destructive/success/warning/info）与图表色板（chart-1..5）。组件不发明自己的彩色。

## Typography

**Body Font:** 系统栈（ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif），经 `--font-sans` 令牌可被皮肤整体替换。

**Character:** 刻意无个性的系统栈——工具型界面里文字的首要职责是清晰与密度，
字体性格留给皮肤与业务页。

### Hierarchy
- **Title**（medium, text-lg/lg 行高）：Card 标题、弹层标题。
- **Body**（normal, 0.875rem, 1.5）：组件默认字号，表单、列表、正文。
- **Label**（medium, 0.875rem）：按钮、表单标签、菜单项。
- **Caption**（normal, 0.75rem, muted-foreground）：辅助说明、描述文字。

### Named Rules
**The System Stack Rule.** 组件库不绑定任何 Web 字体。字体是皮肤的权利，组件只声明字重与字号阶梯。

## Layout

组件自身不拥有页面网格；布局令牌只有两组节奏：

- **Flex 节奏**（--flex-gap: 12px 基准）：small/middle/large 三档按 0.67 / 1.33 / 2 比例派生，皮肤改基准即整体缩放。
- **Grid 节奏**（--grid-gap: 16px）：Grid 组件默认间距。

卡片内部 padding 收敛为 16px 纵向 / 24px 横向（gap-4 py-4）。

## Elevation & Depth

扁平优先。`--card-shadow` 默认为 `none`，深度由两种方式表达：
边框（hairline 灰）与暗色主题下 Panel 比 Paper 浅半阶的色调分层。

### Named Rules
**The Flat-By-Default Rule.** 组件静止态不带阴影。需要浮层感（popover、dialog）时阴影由皮肤经 `--card-shadow` / `--shadow-color` 授予，组件不私自声明。

## Shapes

圆角是唯一强造型语言：基准 `--radius: 0.625rem`（10px），全库按乘法比例派生——
sm 0.6 / md 0.8 / lg 1.0 / xl 1.4 / 2xl 1.8。皮肤改一个基准值，全库圆角等比缩放。

### Named Rules
**The Multiplicative Radius Rule.** 组件只引用 radius 档位，不写死 px 圆角。圆角是全局变量，不是局部决定。

## Components

### Buttons
- **Shape:** 中圆角（--radius-md，8px）
- **Primary:** Ink 底 + primary-foreground 文字（8px 16px padding）
- **Default:** 透明底 + hairline 边框（antd default ≈ shadcn outline）
- **Dashed / Link / Text:** dashed 边框、常态下划线的文字链接（与 text 变体静止态可区分）、ghost 弱填充
- **Danger:** 非文字变体映射 destructive 底；link/text 变体仅文字标红
- **States:** loading 旋转图标并禁用（优先于 icon）；disabled 降透明度且 pointer-events-none

### Cards / Containers
- **Corner Style:** 大圆角（--radius-lg，10px 基准）
- **Background:** Panel 色；bordered=false 时去边框去阴影
- **Border:** hairline；hoverable 卡 hover 时边框染 primary/50 + 背景 accent/50
- **Internal Padding:** 16px 纵向 / 24px 横向，标题行与内容 gap 16px

### Inputs / Fields
- **Style:** hairline 描边（--input）+ Panel 底（--input-background）
- **Focus:** ring 令牌焦点环（outline-ring/50 全局 base 规则）
- **组件级令牌:** switch/slider/radio/progress 的 track、thumb、range 均有独立皮肤令牌，默认回退到语义令牌

### Navigation
- **Sidebar:** 一族语义别名令牌（--sidebar-*）默认随 card/primary/accent 自动适配，暗色下仅 sidebar-primary 刻意覆盖为 Cerulean 蓝紫以区别于反转的浅灰 primary

### Signature: 皮肤契约（Skin Contract）
组件级令牌命名 `--<component>-<part>-<state>`（如 --switch-track-checked、--calendar-today-border），默认值经 var() 回退到语义令牌。这是本库最差异化的设计决定：**覆盖语义令牌时组件自动有合理视觉，覆盖组件级令牌可精细调校**。

### Blocks 层（@pactor-app/blocks）
业务积木（Login、FormModal、FormCardList、EntityCard 等）完全构建在 ui 令牌之上，
不引入自己的颜色；布局与反馈组件（Card、Alert、Button、Empty）的组合即全部视觉。

## Do's and Don'ts

### Do:
- **Do** 用语义令牌表达一切颜色；需要组件级差异时新增 `--<component>-<part>-<state>` 令牌并回退到语义令牌（Skin Authority Rule）。
- **Do** 用 radius 档位表达圆角；需要新档位时按比例从 --radius 派生。
- **Do** 保持 DSL 契约稳定（variant 命名对齐 antd），视觉实现跟随 shadcn 演进。

### Don't:
- **Don't** 在组件里写硬编码颜色字面值——包括「临时」的业务绿、品牌蓝。
- **Don't** 给静止态组件加阴影；浮层阴影由皮肤授予（Flat-By-Default Rule）。
- **Don't** 在组件里引入彩色装饰；彩度只属于语义状态与图表。
- **Don't** 绑定 Web 字体；字体是皮肤的权利。
