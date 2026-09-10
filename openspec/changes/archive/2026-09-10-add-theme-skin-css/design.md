## Context

`@pactor-app/ui` 的视觉基线已是 shadcn 语义令牌体系：`src/styles.css` 在 `:root` 定义 `--background/--foreground/--primary/…`（含 chart-1..5、sidebar 系列、success/warning/info 补充色），`@theme inline` 桥接为 Tailwind 工具类，运行时读 `var()`；暗色经 `[data-pactor-theme='dark']` + `prefers-color-scheme` 兜底（三态）。这天然支持"外部 CSS 覆盖令牌换肤"，但目前存在三个缺口：

1. 可覆盖令牌没有成文契约——皮肤作者不知道能改哪些变量、各管什么；
2. 个别组件存在硬编码颜色/阴影（如阴影色、hover 灰阶直接写 oklch/rgba），皮肤接管不完整；
3. 背景仅支持纯色（`--background` 被当作颜色用），不支持渐变/图片。

约束：纯增量、零新依赖、不破坏现有暗色三态与组件 DOM 结构。

## Goals / Non-Goals

**Goals:**

- 一份完整、文档化的皮肤令牌清单，覆盖 design/theme.md 列出的全部维度：页面背景（纯色/渐变/图片）、卡片阴影、按钮各变体色、圆角、下拉菜单与 Menu/Combobox/Command/ContextMenu 的 hover 与选中背景、Switch/Slider/Radio/Progress/Pagination 组件级颜色、Chart 色板、Calendar 颜色、字体族与文字颜色、sidebar 系列。
- 皮肤加载机制：皮肤 CSS 在 `pactor-ui/styles.css` 之后加载即生效；支持运行时切换（替换 `<link>`/`<style>` 节点）。
- 暗色兼容：皮肤可为 `[data-pactor-theme='dark']`（及跟随系统媒体查询）单独给值，缺省时回退内置暗色令牌。
- 可读性：每个背景类令牌配对 `-foreground` 令牌，文档明确对比度要求。

**Non-Goals:**

- 不做主题编辑器/可视化调色板工具。
- 不做每组件插槽级 CSS 类覆盖 API（皮肤只走令牌层，不改组件结构）。
- 不改变现有组件 props/DOM/暗色三态语义。
- 不动 chart 渲染库内部实现——只保证其色值来自 `--chart-*` 令牌。

## Decisions

### 1. 皮肤只走 CSS 变量层，不引入 JS 主题对象

宿主加载一个普通 CSS 文件（`:root { --primary: … }` 等）即可换肤。理由：令牌体系已经是运行时 `var()` 解析，覆盖成本为零；CSS 文件可被宿主任意托管/内联/按用户切换；不需要运行时 JS API、不需要 React 上下文。替代方案（styled-components 式 theme provider、design token JSON → JS 注入）都引入运行时依赖与序列化成本，对本架构是倒退。

### 2. 令牌分层：语义令牌为主，组件级令牌按需补充

优先复用 shadcn 语义令牌（`--primary` 管主按钮、`--accent` 管 hover 背景等）。仅当语义令牌粒度不够时补组件级令牌，命名约定 `--<component>-<part>-<state>`，例如：

- `--switch-track` / `--switch-thumb`（Switch 轨道/滑块）
- `--slider-track` / `--slider-range` / `--slider-thumb`
- `--radio-border` / `--radio-checked`
- `--progress-track` / `--progress-indicator`
- `--pagination-active-background` / `-border` / `-radius`
- `--menu-hover-background` / `--menu-active-background`（Menu/Combobox/Command/ContextMenu 共用一组）
- `--calendar-*`（选中日、今日、范围等）

组件级令牌的默认值用 `var(--语义令牌, <fallback>)` 引用语义令牌，保证"只覆盖语义令牌也有合理效果"。

### 3. 背景三形式：`--background` + 新增 `--background-image`

`--background` 保持颜色语义（前景配对、暗色回退都依赖它）。渐变/图片由新增 `--background-image`（默认 `none`）承接，应用到 `body`/页面容器：`background-color: var(--background); background-image: var(--background-image);`。皮肤写 `--background-image: linear-gradient(...)` 或 `url(...)` 即可。替代方案（让 `--background` 直接接受渐变）会破坏 `color-mix`/透明度派生等把 `--background` 当颜色的用法，否决。

### 4. 阴影与圆角走既有派生体系，补阴影色令牌

圆角已有 `--radius` 乘法派生（sm..4xl），皮肤改一个 `--radius` 即全局生效，不变。阴影补 `--card-shadow`（默认 `none`，对齐"Card 默认不显示阴影"）与 `--shadow-color`，卡片/弹层阴影从令牌读取。

### 5. 字体：新增 `--font-sans` 族令牌

`:root` 定义 `--font-sans`（默认系统字体栈），body 字体从令牌读取；文字颜色沿用 `--foreground` 及各 `-foreground` 配对令牌。

### 6. 暗色回退策略：皮肤只覆盖它管的作用域

皮肤文件可自选提供 `:root` 单套或 `:root` + `[data-pactor-theme='dark']` 两套。因为内置暗色令牌定义在选择器特异性相同的层，皮肤暗色块按源码顺序覆盖内置值；皮肤未给暗色值时内置暗色继续生效。文档明确推荐"两份皮肤文件（light/dark）或单文件双块"两种写法。

### 7. 硬编码清理方式

逐组件 grep `oklch(`、`rgba(`、`#` 十六进制、Tailwind 静态色类（如 `bg-gray-*`、`text-white`）于 `src/ui/`、`src/components/`、`src/layout/`，迁移到语义或组件级令牌。这是纯机械替换，不改变视觉默认值。

## Risks / Trade-offs

- [组件级令牌清单一旦发布即成公共契约，后续改名是破坏变更] → 命名遵循 `--<component>-<part>-<state>` 统一约定，首批只发布有明确需求的令牌，宁缺毋滥。
- [皮肤作者只覆盖背景不覆盖前景导致可读性失守] → 文档强制"背景/前景成对覆盖"规则并给出对比度要求（WCAG AA 4.5:1）；令牌命名成对（`--x` / `--x-foreground`）从结构上引导。
- [渐变/图片背景下组件文字可读性] → `--background-image` 只作用于页面底层容器，卡片/弹层仍用不透明的 `--card`/`--popover`，天然隔离。
- [运行时切换皮肤时闪烁] → 推荐做法（新样式表 `load` 事件后移除旧表）写入文档指南，框架不内置切换器。
- [组件级令牌与 Tailwind 工具类的映射需要 `@theme inline` 或内联 var()] → 组件级令牌直接在组件样式里 `var()` 读取，不进 `@theme`，避免工具类爆炸。

## Migration Plan

纯增量：不加载皮肤文件时一切与现状一致。docs 新增《皮肤定制》指南页（令牌清单表 + 示例皮肤文件 + 加载/切换代码）。无需回滚策略——删除皮肤 CSS 即恢复默认。

## Open Questions

- chart 组件当前实际读取 `--chart-*` 的程度需在实现期核实，若内部有硬编码色板一并迁移。
- calendar 组件的选中/范围色粒度（是否需 `--calendar-range-middle` 等细分）在实现期按组件现状定夺。
