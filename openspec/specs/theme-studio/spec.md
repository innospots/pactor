# Spec: theme-studio

## Purpose

皮肤工作室（tools/theme-studio）：pactor 应用（DSL 页面），预置风格主题（含中国传统色系列，亮暗双态、语义四色）+ 分组令牌编辑器（颜色/尺寸/风格）+ iframe 画廊实时预览（亮/暗切换）+ 皮肤 CSS 合成与下载。
## Requirements
### Requirement: 工作室布局与预览隔离

主题工作室 SHALL 为仓库根目录 `tools/theme-studio` 下的独立 pactor 应用（`createPactorApplication` + `StaticDslLoader` + DSL 页面，`private: true` 不发布 npm，纳入 pnpm workspace）：工作室页与画廊页 SHALL 以 `*.page.yaml` DSL 结构定义；页面布局为左栏（预置主题 + 令牌编辑器）与右侧 iframe 预览；预置主题列表、令牌编辑器、预览 iframe、下载按钮 SHALL 实现为自定义 React 组件并经 `componentRegistry` 注册后在 DSL 中引用；iframe SHALL 加载同源的 `/gallery` 画廊页，皮肤 CSS SHALL 通过 `postMessage` 传递并在 iframe 内 upsert 单个 `<style>` 节点生效，与宿主真实加载方式（在 `pactor-ui/styles.css` 之后级联覆盖）一致。

iframe 内画廊页 SHALL 在挂载后向父页面发送 `ready` 消息；左栏 MUST 在收到 `ready` 后才发送首次皮肤 CSS。

#### Scenario: 布局呈现

- **WHEN** 打开工作室首页
- **THEN** 左侧为预置主题列表与令牌编辑器，右侧 iframe 加载并渲染 `/gallery` 组件画廊

#### Scenario: DSL 结构

- **WHEN** 查看 `tools/theme-studio/src/pages/`
- **THEN** 工作室页与画廊页均为 `.page.yaml` DSL 页面，经 StaticDslLoader 加载；交互组件经 componentRegistry 注册后在 DSL 中引用

#### Scenario: 首次同步时序

- **WHEN** iframe 内画廊页尚未挂载完成时左栏已有皮肤状态
- **THEN** 左栏等待画廊页 `ready` 消息后才发送皮肤 CSS，首次渲染即为所选主题效果

### Requirement: 预置主题选择与应用

工作室 SHALL 内置至少 5 套**风格化**预置主题——每套是一种完整视觉风格（配色 + 圆角 + 阴影 + 背景底色的组合，如极简、奶油、工业、草木等取向），而非单纯换主色；每套主题 SHALL 同时提供对应的暗色令牌组（`darkTokens`），使皮肤在暗色模式下保持同一风格；主题按钮 SHALL 展示该主题的代表色板（swatches）；点击主题 SHALL 即时应用到右侧预览。主题 MAY 参考中国传统色（china_colors.md）取色。每套主题 SHALL 同时按风格生成语义四色（`--destructive`/`--success`/`--warning`/`--info`，亮暗两组）；每套主题 SHALL 只定义其覆盖的令牌子集（未覆盖的组件级令牌经默认 `var()` 回退自动跟随）。

#### Scenario: 选择主题即时生效

- **WHEN** 用户点击某套预置主题
- **THEN** 右侧画廊的配色、圆角、阴影等立即呈现该主题风格，无需刷新

#### Scenario: 主题按钮展示代表色板

- **WHEN** 查看预置主题列表
- **THEN** 每个主题按钮展示该主题的代表色色板缩略与风格名称

#### Scenario: 预置主题为令牌子集

- **WHEN** 查看任一预置主题的定义
- **THEN** 其仅覆盖该风格需要的令牌子集，未覆盖的组件级令牌经回退跟随语义令牌

### Requirement: 单项令牌编辑与实时预览

左栏 SHALL 按分组列出全部可覆盖皮肤令牌（语义令牌与组件级令牌），颜色类令牌 SHALL 提供取色器（原生 `<input type="color">`）与文本输入，尺寸/字体/背景图类令牌 SHALL 提供文本输入；任一令牌的修改 SHALL 实时（无需刷新、无需额外确认）应用到右侧预览，并叠加在当前所选预置主题之上。

#### Scenario: 修改单个令牌实时生效

- **WHEN** 用户已选「珊瑚赫」主题并将 `--radius` 改为 `1.5rem`
- **THEN** 右侧画廊全部组件圆角立即变大，其余令牌保持主题值

#### Scenario: 令牌清单与 ui 包对齐

- **WHEN** 运行工作室测试
- **THEN** 令牌元数据清单与 `packages/ui/src/styles.css` 的 `:root` 实际令牌集合比对一致（缺失或多余即测试失败）

### Requirement: 皮肤 CSS 生成与下载

工作室 SHALL 将"tokens.ts 令牌默认值 ∪ 预置主题令牌 ∪ 用户修改"（后者优先）合成为一份皮肤 CSS 文本：`:root` 亮色覆盖块 MUST 包含 tokens.ts 登记的全部令牌（预置主题未定义的令牌以默认值出现在导出中，如 `--sidebar` 基座族）；预置主题含 `darkTokens` 时 MUST 同时生成 `[data-pactor-theme='dark']` 暗色覆盖块（暗色块不做默认值兜底，未提供的暗色令牌回退内置暗色皮肤），否则附带注释掉的暗色骨架引导。预览与下载 SHALL 使用同一份合成文本；点击下载 SHALL 经 Blob 生成 `pactor-theme.css` 文件下载，该文件在宿主系统中于 `@pactor-app/ui/styles.css` 之后加载即生效。

#### Scenario: 下载文件可用

- **WHEN** 用户选择主题、修改若干令牌后点击下载
- **THEN** 得到 `pactor-theme.css`，内容为 `:root` 令牌覆盖块（含全部已知令牌）；主题含暗色令牌组时同时含 `[data-pactor-theme='dark']` 块，且与当前预览效果一致

#### Scenario: 导出包含预置主题未定义的令牌

- **WHEN** 所选预置主题未定义 `--sidebar`（基座族）且用户未修改它
- **THEN** 导出 CSS 的 `:root` 块仍包含 `--sidebar`，值为 tokens.ts 登记的默认值

#### Scenario: 覆盖优先级不变

- **WHEN** 同一令牌同时存在于默认值、预置主题与用户修改中
- **THEN** 导出值依次由用户修改 > 预置主题 > 默认值决定

#### Scenario: 导出与预览同源

- **WHEN** 对比下载文件内容与发送给 iframe 的 CSS 文本
- **THEN** 两者完全相同

### Requirement: 组件画廊覆盖全部令牌类型

`/gallery` 画廊页 SHALL 为纯 DSL 页面（`gallery.page.yaml`，仅引用内置组件与 chat 注册组件，不含自定义组件），按分组静态陈列 `@pactor-app/ui` 组件，覆盖范围 MUST 使每类皮肤令牌都有可见的验收对象：基础（Button/Badge/Typography）、表单（Input/Select/Switch/Slider/Radio/Checkbox/Calendar）、反馈（Alert/Progress/Skeleton/Toast 触发）、导航（Menu/Tabs/Pagination/Breadcrumb）、浮层（Dialog/Popover/DropdownMenu 可交互打开）、数据（Card/Table/Chart/Statistic）、chat 系（Bubble/Message/ChatInput）。

#### Scenario: 画廊覆盖组件级令牌验收面

- **WHEN** 在工作室修改 `--switch-track-checked`、`--menu-hover-background`、`--pagination-active-background` 等任一组件级令牌
- **THEN** 画廊中存在对应组件可立即观察到变化

### Requirement: 预览亮色/暗色切换

工作室右侧预览 SHALL 提供亮色/暗色切换控件；切换 SHALL 通过 postMessage 通知 iframe 内画廊页设置对应的 `data-pactor-theme` 属性并即时生效；预览默认亮色（工作室编辑的是亮色令牌，暗色预览用于验收主题暗色风格）。

#### Scenario: 切换暗色预览

- **WHEN** 用户点击预览的暗色切换
- **THEN** iframe 画廊页设置 `data-pactor-theme="dark"`，呈现所选主题的暗色风格

#### Scenario: 暗色风格来自主题

- **WHEN** 在暗色预览下选择不同预置主题
- **THEN** 画廊呈现各主题对应的暗色令牌组效果，而非内置默认暗色

### Requirement: AI 生成入口

主题工作室 SHALL 在工作室页 Header 右端提供「AI 生成」入口按钮，点击后打开 AI 生成滑层（见 theme-studio-ai-generate 能力）；工作室的预览皮肤来源 SHALL 在「预置主题 + 手动令牌覆盖」之外支持「AI 生成结果」，AI 结果 MUST 以与手动覆盖相同的 store 覆盖层机制叠加到预览与下载产物中。

#### Scenario: 入口可见

- **WHEN** 打开主题工作室首页
- **THEN** Header 右端可见「AI 生成」按钮，点击后打开 AI 生成滑层

#### Scenario: AI 结果叠加

- **WHEN** 用户在 AI 滑层中将生成结果应用到预览
- **THEN** 右侧预览与「下载皮肤 CSS」产物与手动修改令牌走同一覆盖层与合成逻辑

