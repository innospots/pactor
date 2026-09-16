# Spec: theme-skin-css

## Purpose

皮肤令牌契约与 CSS 皮肤文件加载/切换机制：宿主在 `@pactor-app/ui/styles.css` 之后加载普通 CSS 文件即可覆盖令牌换肤，支持运行时切换与暗色回退。

## Requirements


### Requirement: 皮肤令牌契约

`@pactor-app/ui` SHALL 定义并文档化一份完整的可覆盖 CSS 变量清单（皮肤令牌），至少覆盖：页面背景、文字颜色、字体族（`--font-sans`）、primary/secondary/destructive/禁用态按钮颜色、圆角（`--radius` 及其派生）、卡片阴影、下拉菜单与 Menu/Combobox/Command/ContextMenu 的 hover 及选中背景、Switch 轨道与滑块颜色、Slider 轨道/进度/滑块颜色、Radio 默认及选中颜色、Progress 背景及进度条颜色、Pagination 当前页背景/边框/圆角、Chart 色板（`--chart-1..5`）、Calendar 颜色、sidebar 系列。

组件级令牌 SHALL 遵循 `--<component>-<part>-<state>` 命名约定，且其默认值 SHALL 通过 `var(--语义令牌, <fallback>)` 引用语义令牌，使仅覆盖语义令牌时组件仍有合理视觉。

#### Scenario: 令牌清单文档可查

- **WHEN** 查阅 docs 皮肤定制指南
- **THEN** 存在完整令牌清单表，每个令牌注明作用元素、默认值与所属分组

#### Scenario: 组件级令牌回退到语义令牌

- **WHEN** 皮肤文件仅覆盖 `--primary` 等语义令牌而未覆盖任何 `--*` 组件级令牌
- **THEN** Switch/Slider/Radio/Progress/Pagination/Menu 等组件呈现与语义令牌一致的合理配色

### Requirement: CSS 皮肤文件加载与运行时切换

宿主 SHALL 能通过在 `pactor-ui/styles.css` 之后加载一个普通 CSS 文件（`<link>` 或内联 `<style>`）覆盖皮肤令牌，无需重新构建 `@pactor-app/ui`；运行时 SHALL 支持通过替换/增删皮肤样式表节点切换皮肤，切换后组件视觉立即更新（令牌经 `var()` 运行时解析）。

#### Scenario: 皮肤文件覆盖默认令牌

- **WHEN** 页面在 `pactor-ui/styles.css` 之后加载定义了 `:root { --primary: <自定义色> }` 的皮肤 CSS
- **THEN** 主按钮等使用 `--primary` 的组件呈现自定义色，且无需重建 UI 包

#### Scenario: 运行时切换皮肤

- **WHEN** 运行时移除皮肤 A 的样式表节点并插入皮肤 B 的样式表节点
- **THEN** 页面组件视觉切换为皮肤 B 的令牌值，无需刷新页面或重建

### Requirement: 页面背景支持纯色、渐变与图片

页面背景颜色 SHALL 由 `--background` 承接；渐变与图片背景 SHALL 由 `--background-image`（默认 `none`）承接，应用于页面底层容器（`background-color: var(--background); background-image: var(--background-image);`）。卡片/弹层等浮层 SHALL 仍使用不透明的 `--card`/`--popover` 背景，与页面背景隔离。

#### Scenario: 渐变背景

- **WHEN** 皮肤设置 `--background-image: linear-gradient(...)`
- **THEN** 页面底层呈现渐变背景，卡片与弹层背景不受影响

#### Scenario: 图片背景

- **WHEN** 皮肤设置 `--background-image: url(...)`（可配合 background-size 等属性）
- **THEN** 页面底层呈现图片背景，卡片与弹层背景不受影响

### Requirement: 暗色模式下的皮肤行为

皮肤文件 SHALL 支持为 `[data-pactor-theme='dark']`（及跟随系统的 `prefers-color-scheme` 媒体查询）单独提供令牌值；皮肤亮色令牌 SHALL 优先于内置系统暗色兜底（兜底选择器经 `:where()` 降为与 `:root` 默认块同优先级，皮肤亮色块 `:root:not([data-pactor-theme='dark'])` 恒高于它），加载皮肤后系统暗色偏好 MUST NOT 把皮肤压成内置暗色。未加载皮肤时，内置暗色三态（light 强制亮 / dark 强制暗 / 不设置跟随系统）语义 MUST NOT 改变。宿主显式设置 `data-pactor-theme="dark"` 时，皮肤暗色块（有则）与内置暗色令牌照常生效。

#### Scenario: 皮肤提供暗色令牌

- **WHEN** 皮肤文件包含 `[data-pactor-theme='dark'] { --primary: <暗色值> }` 且宿主设置 `data-pactor-theme="dark"`
- **THEN** 组件呈现皮肤暗色值而非内置暗色值

#### Scenario: 皮肤未提供暗色令牌

- **WHEN** 皮肤文件仅定义亮色令牌块且宿主未设置 `data-pactor-theme`、系统偏好为暗色
- **THEN** 皮肤亮色令牌继续生效（不被内置暗色兜底压盖）；宿主显式设置 `data-pactor-theme="dark"` 时，未被皮肤暗色块覆盖的令牌回退为内置暗色值，组件视觉不出现未着色的破损状态

### Requirement: 前景文字可读性配对

每个背景类皮肤令牌 SHALL 有对应的 `-foreground` 配对令牌；皮肤定制文档 SHALL 明确要求背景与前景成对覆盖，并给出对比度要求（正文 WCAG AA 4.5:1）。

#### Scenario: 配对令牌齐备

- **WHEN** 审查皮肤令牌清单中所有背景类令牌
- **THEN** 每个背景类令牌均存在对应的前景令牌，且文档标注成对覆盖要求与对比度标准
