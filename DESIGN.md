---
name: Pactor
description: Server-Driven UI 运行时框架的设计系统——中性仪器基座 + 可换肤契约 + 温暖的对话表面
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
  chart-1: "oklch(0.646 0.222 41.116)"
  chart-2: "oklch(0.6 0.118 184.704)"
  chart-3: "oklch(0.398 0.07 227.392)"
  chart-4: "oklch(0.828 0.189 84.429)"
  chart-5: "oklch(0.769 0.188 70.08)"
  chat-bg: "#f7f6f4"
  chat-sidebar-bg: "#efedea"
typography:
  display:
    fontFamily: "'Songti SC', 'Noto Serif SC', Georgia, 'Times New Roman', serif"
    fontSize: "1.5rem"
    lineHeight: 1.3
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.75
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  caption:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.75rem"
    lineHeight: 1.33
rounded:
  sm: "calc(var(--radius) * 0.6)"
  md: "calc(var(--radius) * 0.8)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) * 1.4)"
  pill: "999px"
  chat: "12px"
  chat-xl: "26px"
spacing:
  control-height-sm: "2rem"
  control-height-md: "2.25rem"
  control-height-lg: "2.5rem"
  flex-gap: "12px"
  grid-gap: "16px"
  panel-padding: "1.5rem"
  card-padding: "1rem"
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
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "{spacing.control-height-md}"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
  chat-composer:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.chat}"
    padding: "12px 16px"
---

# Design System: Pactor

## Overview

**Creative North Star: "The Skin-Ready Instrument"**

Pactor 的设计系统是一台刻意中性的仪器：界面的结构色只有 OKLCH 无彩灰阶，
所有视觉决定都解析为 CSS 自定义属性，把「性格」让渡给三样东西——皮肤
（`@pactor-app/theme` 的 14 套预置 + 业务自定义）、密度档位
（`data-pactor-size`）、以及对话表面（chat）那一小块被允许温暖的区域。
它不是用来展示的视觉系统，而是承载别人产品的基座：业务方下发什么 DSL，
它就忠实地渲染什么性格。

系统的分层非常清晰：`@pactor-app/ui` 持有 shadcn 语义令牌与全部基础组件
（细目见子文档 `packages/ui/DESIGN.md`，本文档与其保持一致并覆盖全局）；
`@pactor-app/chat` 在灰阶基座上叠加暖白灰与衬线展示字体，形成「工作区克制、
对话区温暖」的双表面结构；blocks/chart/shell 一律不引入自己的颜色。

**Key Characteristics:**
- 中性灰阶 OKLCH 基座，light/dark/跟随系统三态，皮肤后置加载即拥有最终裁量权
- 扁平优先：静止态零阴影，深度靠 hairline 边框与色调分层；唯一的例外是 chat composer 的浮起感
- 双表面：Operate 表面（admin/表格/表单）绝对克制，Chat 表面允许暖底 + 衬线标题的人性化
- 密度即令牌：`--pactor-control-*` 体系让控件高度/字号/面板间距随 `data-pactor-size` 三档整体缩放
- 一切圆角乘法派生自 `--radius`（0.625rem）基准

## Colors

调色板 = 无彩灰阶承载全部界面结构 + 四个语义状态色 + 五阶图表色板 + chat 专属暖底；彩度不出现在结构件上。

### Primary
- **Ink**（oklch(0.205 0 0)，dark 反转为 oklch(0.922 0 0)）：主按钮、选中态、进度指示。近黑而非纯黑——primary 是「最重的中性色」，不是品牌色。

### Neutral
- **Paper**（oklch(1 0 0)，dark oklch(0.145 0 0)）：页面背景。
- **Panel**（oklch(1 0 0)，dark oklch(0.205 0 0)）：card / popover 表面，dark 下比背景浅半阶，无阴影分层。
- **Whisper**（oklch(0.97 0 0)，dark oklch(0.269 0 0)）：muted / secondary / accent 共用的浅灰填充，hover 与弱强调的唯一灰。
- **Ash**（oklch(0.556 0 0)，dark oklch(0.708 0 0)）：次要文字。
- **Hairline**（oklch(0.922 0 0)，dark 10% 白）：边框与输入框描边。

### Semantic
- **Signal Red**（oklch(0.577 0.245 27.325)）：destructive，危险操作与错误。
- **Verdant**（oklch(0.696 0.17 162.48)）：success。
- **Amber**（oklch(0.769 0.188 70.08)）：warning。
- **Cerulean**（oklch(0.623 0.214 259.815)）：info；同时是 dark 主题下 sidebar 选中态的刻意例外色。

### Chat 表面
- **Warm Paper**（#f7f6f4）：chat 对话区底色，比纯白暖半度。
- **Warm Sidebar**（#efedea）：chat 侧栏底色，比对话区深一档。

### 图表
- chart-1..5（橙 / 青 / 深青 / 金 / 琥珀）：数据可视化专用彩度，经 `--chart-*` 令牌供给 `@pactor-app/chart`。

### Named Rules
**The Skin Authority Rule.** 任何组件颜色必须来自语义令牌或组件级令牌（`var()`），禁止硬编码色值进组件；皮肤在样式表之后加载即拥有最终裁量权。覆盖入口必须在 `:root`（portaled 浮层挂在 document.body）。

**The One Accent Rule.** 界面结构色只有灰阶；彩度只属于语义状态、图表与 chat 产物图标色调。组件不发明自己的彩色。

**The Two Surfaces Rule.** 暖色只允许出现在 chat 表面（`--pactor-chat-*` 令牌族）；admin/表格/表单等 Operate 表面保持无彩灰阶。

## Typography

**Display Font:** 衬线展示栈（'Songti SC', 'Noto Serif SC', Georgia, serif）——**仅** chat 空态问候与对话标题（`--pactor-chat-font-display`）。
**Body Font:** 系统栈（ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif），经 `--font-sans` 可被皮肤整体替换。

**Character:** 工作区文字刻意无个性（清晰与密度优先）；衬线是 chat 表面的专属人性化签名，两处字体的边界就是两个表面的边界。

### Hierarchy
- **Display**（serif, 1.5rem, 1.3）：chat 空态问候语；不出现第二处。
- **Title**（medium, text-lg）：Card 标题、弹层标题。
- **Body**（normal, 0.875rem, 1.5）：组件默认字号，跟随密度档位（`--pactor-control-text-md`）。
- **Label**（medium, 0.875rem）：按钮、表单标签、菜单项。
- **Caption**（normal, 0.75rem, Ash）：辅助说明、描述文字。
- **Chat 阶梯**（仅 `--pactor-chat-*` 表面，独立于工作区）：micro chip（10px）、badge/分组标签（11px）、meta（11.5-12px）、次级正文（12.5px）、meta 强调（13px）、消息正文（15px）、空态问候（26px，衬线 Display）。对话信息密度高于工作区，阶梯更密是有意设计。

### Named Rules
**The System Stack Rule.** 组件不绑定任何 Web 字体；字体是皮肤的权利，组件只声明字重与字号阶梯。

**The Serif Boundary Rule.** 衬线字体只存在于 chat 展示位（问候、标题）；Operate 表面出现衬线即为 bug。

## Layout

框架不拥有页面网格——布局由 bootstrap 下发（admin / blank / login / landing / chat 五种布局壳），组件层只有节奏令牌：

- **控件高度阶梯**（`--pactor-control-height-*`）：xs 1.5 / sm 2 / md 2.25 / lg 2.5rem，12 个 DSL 表单控件与 vendored 原语全部跟随；`data-pactor-size="compact|comfortable"` 整体升降档，default 档即现行尺寸。
- **面板间距**（`--pactor-panel-padding: 1.5rem` / `--pactor-card-padding: 1rem`）：Dialog/Drawer/Popover 与 Card/Alert 的内边距令牌化，可经 JS 自定义数值整体覆盖。
- **Flex / Grid 节奏**：`--flex-gap: 12px`（small/middle/large 按 0.67/1.33/2 派生）、`--grid-gap: 16px`。
- **Chat 列**：对话列定宽 `--pactor-chat-content-width: 768px` 居中，产物面板宽度 = 对话列宽，钳制在 480px ~ 宿主 2/3。
- **Admin 壳断点**：xs-xxl（480/576/768/992/1200/1600），侧栏折叠走 useMediaQuery；侧栏宽度令牌 `--sidebar-width` / `--sidebar-width-icon`。

### Named Rules
**The Density Dial Rule.** 改密度只准调 `--pactor-control-*` 令牌或 `data-pactor-size` 档位；禁止给单个控件写死高度补丁（tailwind-merge 会盖掉令牌，造成 1-2px 回归）。

## Elevation & Depth

扁平优先：`--card-shadow` 默认为 `none`。静止态深度只由 hairline 边框与 dark 主题下 Panel 浅半阶的色调分层表达。

唯一的阴影词汇在 chat 表面与浮层：

### Shadow Vocabulary
- **Whisper Shadow**（`--pactor-chat-shadow-sm`: `0 1px 2px rgb(0 0 0 / 4%)`）：chat 卡片微分层，几乎不可见。
- **Composer Lift**（`--pactor-chat-shadow-composer`: `0 1px 2px rgb(0 0 0 / 3%), 0 10px 28px -10px rgb(0 0 0 / 8%)`）：chat 输入框的浮起感——全系统唯一常驻阴影，因为输入框是对话的舞台。

### Named Rules
**The Flat-By-Default Rule.** 组件静止态不带阴影；浮层（popover/dialog）阴影由皮肤经 `--card-shadow` / `--shadow-color` 授予，组件不私自声明。

## Shapes

圆角是唯一强造型语言，两套尺度：

- **工作区尺度**：基准 `--radius: 0.625rem`（10px），全库乘法派生——sm 0.6 / md 0.8 / lg 1.0 / xl 1.4 / 2xl 1.8。皮肤改一个基准值，全库等比缩放。
- **Pill**（999px）：徽章、状态点、头像、进度条的胶囊/正圆，全局通用，不参与乘法派生。
- **Chat 尺度**：独立令牌族 `--pactor-chat-radius-*`（6 / 8 / 12 / 16 / 26px），气泡与 composer 用更软的 12-26px，与 Operate 表面的工具感拉开距离。

### Named Rules
**The Multiplicative Radius Rule.** 组件只引用 radius 档位，不写死 px 圆角；圆角是全局变量，不是局部决定。

## Components

### Buttons
- **Shape:** 中圆角（--radius-md，8px 基准）
- **Primary:** Ink 底 + primary-foreground 文字（8px 16px padding）
- **Default:** 透明底 + hairline 边框；**Dashed / Link / Text:** 虚线框、常态下划线链接、ghost 弱填充；**Danger:** 非文字变体 destructive 底，link/text 仅文字标红
- **States:** loading 旋转图标并禁用（优先于 icon）；disabled 降透明度且 pointer-events-none

### Inputs / Fields
- **Style:** hairline 描边（--input）+ Panel 底；高度走 `--pactor-control-height-*` 密度阶梯（middle = 2.25rem）
- **Focus:** `--ring` 令牌焦点环（全局 base 规则 outline-ring/50）
- **组件级令牌:** switch/slider/radio/progress 的 track、thumb、range 均有独立皮肤令牌，默认回退语义令牌

### Cards / Containers
- **Corner Style:** 大圆角（--radius-lg）；**Background:** Panel 色；**Border:** hairline
- **Internal Padding:** `--pactor-card-padding`（1rem）基准，DSL Card 标题行与内容 gap 16px
- **hoverable** 卡 hover 时边框染 primary/50 + 背景 accent/50

### Navigation
- **Sidebar:** `--sidebar-*` 语义别名族默认随 card/primary/accent 自动适配；dark 下仅 sidebar-primary 刻意覆盖为 Cerulean，区别于反转的浅灰 primary
- **Admin 壳导航行**走 `--pactor-menu-nav-padding-y` / `--pactor-menu-item-padding-y`，禁止硬编码 padding 补丁

### Chat 表面（Signature）
- **Composer:** Warm Paper 上的白卡 + Composer Lift 阴影 + 12px 圆角；空态下问候组与输入框垂直居中成组，有消息后恢复钉底
- **气泡:** user 右气泡 / assistant 通栏；artifact 卡片带色调图标盒（image/violet、table/green、database/amber、code/blue、terminal/blue、file-text/slate，经 `--pactor-chat-artifact-tone-*`）
- **AppShell:** 品牌行 + icon rail 折叠（桌面）+ 移动端抽屉遮罩

### Blocks 与 Chart
- blocks（Login、FormModal、EntityCard 等）完全构建在 ui 令牌之上，不引入颜色
- chart 组件只吃 `--chart-*` 五色板；MetricCard 等数据展示卡遵守同一令牌体系

### 皮肤契约（Skin Contract，Signature）
组件级令牌命名 `--<component>-<part>-<state>`（如 `--switch-track-checked`），默认值经 var() 回退到语义令牌：覆盖语义令牌时组件自动有合理视觉，覆盖组件级令牌可精细调校。这是全系统最差异化的设计决定。

## Do's and Don'ts

### Do:
- **Do** 用语义令牌表达一切颜色；需要组件级差异时新增 `--<component>-<part>-<state>` 令牌并回退到语义令牌（Skin Authority Rule）。
- **Do** 用 radius 档位表达圆角；需要新档位时按比例从 `--radius` 派生。
- **Do** 用 `text-[length:var(--x)]` 配显式 `leading-*` 表达令牌化字号（`text-(--x)` 会编译为颜色且不携带行高）。
- **Do** 把皮肤覆盖放在 `:root` 与 documentElement 链上（portaled 浮层挂在 body，暗色选择器须命中 documentElement）。
- **Do** 多维度自定义尺寸时合并为一次 `applyGlobalSizeValues` 调用（分次调用会互相清除）。

### Don't:
- **Don't** 在组件里写硬编码颜色字面值——包括「临时」的业务绿、品牌蓝。
- **Don't** 给静止态组件加阴影；浮层阴影由皮肤授予（Flat-By-Default Rule）。
- **Don't** 在 Operate 表面引入彩色装饰或衬线字体；彩度只属于语义状态、图表与 chat 产物图标。
- **Don't** 绑定 Web 字体；字体是皮肤的权利。
- **Don't** 给 AdminLayout 导航行写 `py-2` 这类硬编码补丁盖掉 `--pactor-menu-*` 令牌。
