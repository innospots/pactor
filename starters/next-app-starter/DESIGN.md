---
name: Pactor Next App Starter
description: Server-Driven UI 管理台模板：冷灰底色、低饱和蓝灰主色、克制的中性控制台
colors:
  harbor-slate: "#536b7f"
  harbor-slate-ink: "#f8fafc"
  cool-paper: "#f4f6f8"
  card-white: "#ffffff"
  ink-charcoal: "#242b33"
  ash-secondary: "#e9edf1"
  ash-secondary-ink: "#33404c"
  mist-muted: "#edf0f3"
  mist-muted-ink: "#66727e"
  frost-accent: "#e4eaf0"
  frost-accent-ink: "#33485a"
  signal-red: "#b65454"
  signal-green: "#4f7c67"
  signal-amber: "#9a6d2f"
  signal-blue: "#58768f"
  hairline-border: "#d7dde3"
  input-line: "#c7d0d8"
  focus-ring: "#718698"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.harbor-slate}"
    textColor: "{colors.harbor-slate-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-charcoal}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  input-default:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-charcoal}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
    height: "36px"
  card-surface:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-charcoal}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-status:
    backgroundColor: "{colors.ash-secondary}"
    textColor: "{colors.ash-secondary-ink}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Pactor Next App Starter

## Overview

**Creative North Star: "The Quiet Console"（安静控制台）**

这是一套为长时间工作设计的管理台视觉系统：冷灰纸面底色（#f4f6f8）托出纯白卡片，唯一的彩色声音是低饱和的雾港蓝灰主色（#536b7f），像港口清晨的天光，专业但不冷漠。系统的设计语言全部服从 Operate 场景：扫读效率、状态可辨、动作可达，表达欲只出现在 hover 浮起、状态徽标这类精确的细节里。

全部视觉决策走三层令牌架构：pactor ui 基线提供语义令牌与 preflight，`public/skins/<skin>.css` 是唯一令牌权威（当前仅 neutral 一套，明暗双主题内联其中），项目级 `globals.css` 只承担皮肤无关的外壳规则。页面由 DSL 下发渲染，因此「美观」的护栏不在页面层，而在这份令牌与组件约定里。

**Key Characteristics:**
- 低饱和蓝灰单主色，冷灰中性底色，无高彩度装饰
- 默认扁平，阴影仅作为交互状态的回应（hover 浮起、弹层遮罩）
- 10px 圆角基调，统一的 12/16px 间隙节奏
- 外壳固定（Header + 侧栏），仅内容区滚动
- 卡片操作按钮 hover / 聚焦才显现，静止时界面保持安静

## Colors

调色板性格：冷灰为纸、雾蓝为声，语义色全部降饱和处理，与主色同处一个灰度家族。

### Primary
- **Harbor Slate 雾港蓝灰** (#536b7f): 唯一主色。主按钮、选中态、启用图标、图表第一色。它承载所有「可以做」的信号，因此必须稀有。
- **Harbor Slate Ink** (#f8fafc): 主色上的前景文字，近白带一点点冷。

### Neutral
- **Cool Paper 冷纸灰** (#f4f6f8): 应用底色。比纯白低半档亮度，让白卡片自然浮出，不需要投影。
- **Card White 卡片白** (#ffffff): 卡片、弹层、输入框的表面色。
- **Ink Charcoal 炭墨** (#242b33): 正文与标题前景，不是纯黑，冷调灰黑。
- **Mist Muted 雾灰** (#edf0f3): 次级表面（表格条纹、禁用底、轨道色）。
- **Mist Muted Ink** (#66727e): 次要文字、占位符、弱化图标。
- **Frost Accent 霜蓝** (#e4eaf0): 菜单 hover/active、日历选中范围的背景；其前景 #33485a 是同族深色。
- **Hairline Border 发丝边** (#d7dde3): 卡片与分区边界，1px 使用。
- **Input Line** (#c7d0d8): 输入框描边与开关轨道，比 hairline 深半档。
- **Focus Ring** (#718698): 焦点环，主色的浅一度版本。

### Semantic
- **Signal Red 信号红** (#b65454): 破坏性动作与错误，降饱和避免惊扰。
- **Signal Green 苔藓绿** (#4f7c67): 成功与「启用」状态（徽标实际用 #22c55e 族 15% 底纹 + #16a34a 文字，暗色 #4ade80）。
- **Signal Amber 琥珀** (#9a6d2f): 警告与「已过期」状态。
- **Signal Blue 信息蓝** (#58768f): 信息提示，与主色同族不同阶。

### Named Rules
**The One Voice Rule.** 任一屏内主色（Harbor Slate）占用不超过 10% 的表面。它是界面里唯一的大嗓门，稀有性就是它的意义；状态色各就各位，不与主色抢话。

**The Skin Authority Rule.** 颜色只许来自语义令牌（var(--primary)、var(--card)…）。组件与 DSL 里出现硬编码 hex 即违规；换肤靠替换 skins/*.css，令牌表之外不存在第二事实源。

## Typography

**Display Font:** 系统栈（ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto…）
**Body Font:** 同上，单一字族承担全部角色
**Mono Font:** ui-monospace 默认栈（行内代码、表达式、ID 类文本）

**Character:** 不装字体文件，刻意选择零加载成本与各平台原生观感；层级完全靠字重（400/500/600/800）与字距（标题 -0.025em 收紧）拉开，中文环境下系统栈的屏显质量稳定。

### Hierarchy
- **Display** (800, 36px / 2.25rem, tracking-tight): 仅营销级大标题（Typography h1），管理台页面几乎不用。
- **Headline** (600, 24px / 1.5rem, tracking-tight): 页面主标题（Typography h3，页面约定层级），如「仪表盘」。
- **Title** (600, 20px / 1.25rem): 卡片标题、弹层标题（h4）；h2（30px + 下边框）保留给长文场景。
- **Body** (400, 14px / 0.875rem, line-height 1.6): 界面正文的实际工作字号；长段落（Typography p）为 16px / leading-7。
- **Muted** (400, 14px, muted-ink): 副标题、辅助说明，页面头部固定的「主标题 + 灰副标题」组合。
- **Label** (500, 12px / 0.75rem): 徽标、表单项标签、小字元信息。

### Named Rules
**The Two-Weight Rule.** 常规界面只用 400 与 600 两个字重，500 留给 label 级小字，800 留给 display。层级靠字号与灰度，不靠字重堆叠。

## Layout

外壳为固定式管理台骨架：顶部 Header 与左侧 Sidebar 锁定视口（.shell-root: 100dvh, overflow hidden），仅中间内容区滚动（.shell-content），侧栏菜单独立滚动。侧栏宽 16rem，折叠为 3rem 图标栏。

内容区遵循一致的页面文法：页头行（Flex space-between：左侧主标题 h3 + 灰副标题基线对齐，右侧操作区）→ 指标卡网格（Grid 多列，gap 16px，卡片同高 .stat-card）→ 数据主体（表格 / 卡片网格 / 表单）。

间距节奏基于两档令牌：flex-gap 12px（sm 8px / md 16px / lg 24px 倍率派生）与 grid-gap 16px；页级区块间隔 16px（marginBottom: 16 的 Alert / 网格行）。卡片内边距 16px，Statistic 标题与数值间 6px。

### Named Rules
**The Content-Scrolls Rule.** 视口内只允许内容区滚动。新增外壳级区域（次侧栏、底部栏）必须并入固定骨架，不得引入第二个纵向滚动容器。

## Elevation & Depth

扁平为默认。层次由「冷灰底 + 白卡」的明度差承担，而非投影；描边（1px hairline）是分区的主要手段。

### Shadow Vocabulary
- **Card Rest** (`0 4px 16px rgb(36 43 51 / 6%)`, --card-shadow): 卡片静息态的极轻环境影，几乎不可见，只负责把卡片从底色里「揭」起来。
- **Hover Lift** (`0 8px 24px color-mix(in srgb, var(--foreground) 12%, transparent)`): 可点击卡片（Provider/Model 数据卡）hover 时的浮起回应，同时描边加深到 20% 前景色。
- **Overlay Dim** (`rgb(15 23 32 / 48%)`, --overlay-background): 弹层遮罩，冷调深灰蓝而非纯黑。

### Named Rules
**The Flat-By-Default Rule.** 表面静止时扁平；阴影只允许作为状态的回应出现（hover、弹层、拖拽）。给静止元素加「装饰性投影」即违规。

## Shapes

圆角基调 10px（--radius），组件按层级递减：卡片 / 弹层 / 输入框用 lg 10px 与 md 8px，徽标与小控件用 sm 6px；分页选中块用 radius × 0.8。全系统无尖角宣言也无全圆胶囊（头像与色点除外），剪影语言是「柔和的工程感」：可点击的卡片整张是形状的主体，内部不再嵌套卡片。

## Components

### Buttons
- **Shape:** 圆角矩形（8px radius）
- **Primary:** Harbor Slate 底（#536b7f）+ 近白文字（#f8fafc），内边距 8px 16px；一个视图只许一个 primary。
- **Outline / Secondary:** 白底 hairline 描边或 ash 底（#e9edf1）深灰文字，承担次要动作。
- **Hover / Focus:** 颜色微调过渡（0.2s ease），焦点环用 Focus Ring（#718698）；无位移、无缩放戏法。

### Cards / Containers
- **Corner Style:** 柔和圆角（10px radius）
- **Background:** Card White（#ffffff）置于 Cool Paper（#f4f6f8）之上
- **Border:** 1px hairline（#d7dde3）；可点击卡片 hover 时描边加深 + Hover Lift 投影
- **Shadow Strategy:** 见 Elevation；静息近无影，hover 浮起
- **Internal Padding:** 16px；内部区块间隙 12px，末位区块（能力标签行 / 路由摘要行）用 margin-top:auto 钉底，保证网格同高
- **Actions:** 卡片右上角操作按钮组默认隐藏（opacity 0 + pointer-events none），hover 或焦点进入（:focus-within，键盘 Tab / 触屏可达）时淡入

### Badges / Status
- **Style:** 小圆角（6px），内边距 2px 8px，12px 中字重，前置 ● 圆点表状态
- **Mapping:** 启用 → success 令牌派生底纹（15% 底 + 45% 边 + success 文字，暗色文字向白提亮 70%）；停用 / 草稿 → ash 灰底；已过期 → warning 令牌派生底纹（同构派生）
- **Rule:** 状态永远「颜色 + 圆点 + 文字」三通道，不单独依赖颜色传达

### Inputs / Fields
- **Style:** 白底、Input Line 描边（#c7d0d8）、8px 圆角、36px 高、内边距 6px 12px
- **Focus:** 描边切换为 Focus Ring（#718698）+ 细环晕
- **Error / Disabled:** 错误态 Signal Red 描边与提示；禁用态 Mist Muted 底 + 降透明度

### Navigation
- **Sidebar:** 白底（=卡片面）、16rem 宽，菜单项圆角 8px；hover 与 active 同为 Frost Accent 底（#e4eaf0）+ 深族文字（#33485a），active 以字重区分；折叠为 3rem 图标栏，悬停出 tooltip
- **Header:** 固定在骨架顶部，右侧依次为用户区、皮肤切换（色点 + 名称下拉）、明暗切换（太阳 / 月亮图标按钮）
- **移动端:** 侧栏转为覆盖式抽屉，内容区全宽

### Statistic 指标卡（Signature）
核心概览指标牌：卡片同高网格（.stat-card height 100%），标题 12px 灰字、数值大字、右上角图标弱化（muted-ink 65% 透明度）避免与主数字争夺层级，标题与数值间固定 6px 节奏。

### Theme Switcher（Signature）
Header 右侧的皮肤与明暗入口：皮肤项为「色点 + 名称」下拉（当前项打勾），切换即换 link 皮肤样式表并持久化 localStorage(mc-skin)；明暗按钮写 data-pactor-theme="dark"，缺省跟随系统。首屏由 layout.tsx 内联脚本预置，避免闪烁。

## Do's and Don'ts

### Do:
- **Do** 一切颜色走语义令牌（var(--primary) / var(--card) / var(--muted-foreground)…），包括 DSL 内联 style 与自定义组件。
- **Do** 新皮肤以 public/skins/<name>.css 完整复制令牌表（明暗双段），并在 skin.ts 的 SKINS 注册色点与名称。
- **Do** 暗色适配只改令牌表（[data-pactor-theme='dark'] 段），组件不写暗色分支；必须写时用 color-mix 派生（如 hover 阴影取 foreground 12%）。
- **Do** 保持「静止安静、hover 回应」：卡片操作按钮 hover 显现、投影只在交互态出现。
- **Do** 页面遵守页头文法：主标题 h3 + 灰副标题 baseline 对齐 + 右侧操作区，区块间隔 16px。
- **Do** 状态表达用三通道（颜色 + 圆点/图标 + 文字），暗色主题下提亮文字色（如 #4ade80）。

### Don't:
- **Don't** 在组件、DSL style 或页面 CSS 里硬编码 hex；skins/*.css 之外不存在颜色事实源。
- **Don't** 给静止表面加装饰性投影，或用投影代替描边做分区；层次靠明度差与 hairline。
- **Don't** 嵌套卡片；卡片网格里同尺寸卡片重复超过一屏时，改用列表或表格。
- **Don't** 引入字重堆叠（同一视图出现 400/500/600/700/800 三种以上）或加载 Web 字体；系统栈是有意的选择。
- **Don't** 用纯色 #000 / #fff：最深的文字是 Ink Charcoal（#242b33），最亮的表面是 Card White（#ffffff），遮罩用冷调深灰蓝。
- **Don't** 破坏外壳骨架：禁止在内容区之外新增滚动容器，禁止页面级 fixed 元素覆盖 Header。
