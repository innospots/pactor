## ADDED Requirements

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

工作室 SHALL 内置多套预置主题，其中 SHALL 包含依据中国传统色（china_colors.md，384 色按 24 节气分组）生成的至少 5 套主题（如 珊瑚赫/青冥/碧山/梔子/齊紫 色系）；每套预置主题 SHALL 只定义其覆盖的语义令牌子集（组件级令牌经默认 `var()` 回退自动跟随）；点击主题 SHALL 即时应用到右侧预览。

#### Scenario: 选择主题即时生效

- **WHEN** 用户点击预置主题「青冥」
- **THEN** 右侧画廊的主按钮、焦点环、图表色板等立即呈现该主题配色，无需刷新

#### Scenario: 预置主题为令牌子集

- **WHEN** 查看任一预置主题的定义
- **THEN** 其仅覆盖语义令牌子集，未含 `--switch-track` 等组件级令牌，组件级视觉经回退跟随语义令牌

### Requirement: 单项令牌编辑与实时预览

左栏 SHALL 按分组列出全部可覆盖皮肤令牌（语义令牌与组件级令牌），颜色类令牌 SHALL 提供取色器（原生 `<input type="color">`）与文本输入，尺寸/字体/背景图类令牌 SHALL 提供文本输入；任一令牌的修改 SHALL 实时（无需刷新、无需额外确认）应用到右侧预览，并叠加在当前所选预置主题之上。

#### Scenario: 修改单个令牌实时生效

- **WHEN** 用户已选「珊瑚赫」主题并将 `--radius` 改为 `1.5rem`
- **THEN** 右侧画廊全部组件圆角立即变大，其余令牌保持主题值

#### Scenario: 令牌清单与 ui 包对齐

- **WHEN** 运行工作室测试
- **THEN** 令牌元数据清单与 `packages/ui/src/styles.css` 的 `:root` 实际令牌集合比对一致（缺失或多余即测试失败）

### Requirement: 皮肤 CSS 生成与下载

工作室 SHALL 将"当前预置主题令牌 ∪ 用户修改"合成为一份皮肤 CSS 文本（`:root` 覆盖块，MUST 附带注释掉的 `[data-pactor-theme='dark']` 暗色骨架引导），预览与下载 SHALL 使用同一份合成文本；点击下载 SHALL 经 Blob 生成 `pactor-theme.css` 文件下载，该文件在宿主系统中于 `@pactor-app/ui/styles.css` 之后加载即生效。

#### Scenario: 下载文件可用

- **WHEN** 用户选择主题、修改若干令牌后点击下载
- **THEN** 得到 `pactor-theme.css`，内容为 `:root` 令牌覆盖块（含注释的暗色骨架），且与当前预览效果一致

#### Scenario: 导出与预览同源

- **WHEN** 对比下载文件内容与发送给 iframe 的 CSS 文本
- **THEN** 两者完全相同

### Requirement: 组件画廊覆盖全部令牌类型

`/gallery` 画廊页 SHALL 为纯 DSL 页面（`gallery.page.yaml`，仅引用内置组件与 chat 注册组件，不含自定义组件），按分组静态陈列 `@pactor-app/ui` 组件，覆盖范围 MUST 使每类皮肤令牌都有可见的验收对象：基础（Button/Badge/Typography）、表单（Input/Select/Switch/Slider/Radio/Checkbox/Calendar）、反馈（Alert/Progress/Skeleton/Toast 触发）、导航（Menu/Tabs/Pagination/Breadcrumb）、浮层（Dialog/Popover/DropdownMenu 可交互打开）、数据（Card/Table/Chart/Statistic）、chat 系（Bubble/Message/ChatInput）。

#### Scenario: 画廊覆盖组件级令牌验收面

- **WHEN** 在工作室修改 `--switch-track-checked`、`--menu-hover-background`、`--pagination-active-background` 等任一组件级令牌
- **THEN** 画廊中存在对应组件可立即观察到变化
